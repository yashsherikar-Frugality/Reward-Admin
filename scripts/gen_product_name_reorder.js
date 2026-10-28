/*
 * Strips each issuer's own brand/card-family word out of product names
 * entirely (it's redundant — the issuer column already says "Bank of
 * Baroda"): "BOBCARD Corporate" -> "Corporate", "CMA One BOBCARD" -> "CMA One".
 * Co-brand partner names (Swiggy, Tata, InterMiles, PVR...) and tier words
 * (Platinum, World) are left exactly where they are — only the issuer's own
 * brand word is removed, wherever it appears in the name.
 *
 *   node scripts/gen_product_name_reorder.js "<folder with cards_rows.csv>"
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC_DIR = process.argv[2];
if (!SRC_DIR) { console.error('Usage: node scripts/gen_product_name_reorder.js <folder with cards_rows.csv>'); process.exit(1); }

const BRAND_WORD = {
    'Axis Bank': ['Axis', 'AXIS'],
    'Bank of Baroda': ['BOBCARD'],
    'HDFC Bank': ['HDFC'],
    'ICICI Bank': ['ICICI'],
    'IDFC FIRST Bank': ['FIRST'],
    'Kotak Mahindra Bank': ['Kotak'],
    'RBL Bank': ['RBL'],
    'SBI Card': ['SBI'],
    'YES BANK': ['YES'],
};
// These 5 issuers' own name is "<word> Bank" — "Bank" leaks into product
// text right next to the brand word ("Axis Bank Privilege..."). Strip the
// two-word phrase as a unit, NOT a bare "Bank" everywhere — other issuers'
// products legitimately contain other banks' full names as co-brand
// partners ("Nainital Bank RENAISSANCE BOBCARD", "South Indian Bank SBI...").
const BRAND_PHRASE = {
    'Axis Bank': /\bAxis\s+Bank\b/gi,
    'HDFC Bank': /\bHDFC\s+Bank\b/gi,
    'ICICI Bank': /\bICICI\s+Bank\b/gi,
    'RBL Bank': /\bRBL\s+Bank\b/gi,
    'YES BANK': /\bYES\s+BANK\b/gi,
    'SBI Card': /\bSBI\s+Card\b/gi,
};
// Universal cleanup, all issuers: a trailing "Credit Card" / "Card" is just
// noise ("Kwik Credit Card" -> "Kwik") — strip it from the END only, never
// mid-string, so a genuinely meaningful "Card" elsewhere in a name survives.
const GENERIC_TRAILING = /\s+(Credit\s+Card|Cards|Card)$/i;
function stripGenericTrailing(text) {
    let t = text;
    let prev;
    do { prev = t; t = t.replace(GENERIC_TRAILING, ''); } while (t !== prev);
    return t;
}

function parseCSV(text) {
    const rows = []; let row = []; let field = ''; let inQ = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQ) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; } else field += c; }
        else { if (c === '"') inQ = true; else if (c === ',') { row.push(field); field = ''; } else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; } else if (c === '\r') { } else field += c; }
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
}

const rows = parseCSV(fs.readFileSync(path.join(SRC_DIR, 'cards_rows.csv'), 'utf8'));
const hdr = rows[0];
const iIssuer = hdr.indexOf('issuer'), iProduct = hdr.indexOf('product'), iId = hdr.indexOf('card_id');
const data = rows.slice(1).filter(r => r.length === hdr.length && r[0]);

function stripBrand(issuer, product) {
    let text = product;
    if (BRAND_PHRASE[issuer]) text = text.replace(BRAND_PHRASE[issuer], ' ');
    const brands = BRAND_WORD[issuer];
    if (brands) text = text.split(/\s+/).filter(w => !brands.includes(w)).join(' ');
    text = text.replace(/\s{2,}/g, ' ').trim();
    text = stripGenericTrailing(text);
    const stripped = text.replace(/\s{2,}/g, ' ').trim();
    return stripped || product;   // never leave it blank
}

// Reconstruction of the PREVIOUS run's transform (5 bank-phrases, no SBI Card
// phrase, no generic Card/Credit strip) — this is what's actually live in the
// DB right now, so it's the match key for THIS run's UPDATE, not the raw CSV
// text (which the DB has already moved past) and not the new stripBrand()
// output (which is the target, not the source).
const BRAND_PHRASE_V1 = {
    'Axis Bank': /\bAxis\s+Bank\b/gi, 'HDFC Bank': /\bHDFC\s+Bank\b/gi,
    'ICICI Bank': /\bICICI\s+Bank\b/gi, 'RBL Bank': /\bRBL\s+Bank\b/gi,
    'YES BANK': /\bYES\s+BANK\b/gi,
};
function stripBrandV1(issuer, product) {
    let text = product;
    if (BRAND_PHRASE_V1[issuer]) text = text.replace(BRAND_PHRASE_V1[issuer], ' ');
    const brands = BRAND_WORD[issuer];
    if (brands) text = text.split(/\s+/).filter(w => !brands.includes(w)).join(' ');
    const stripped = text.replace(/\s{2,}/g, ' ').trim();
    return stripped || product;
}

// Dollar-quoted, not '...' with doubled apostrophes — see gen_card_id_rename.js
// for why: a naive client-side statement splitter can mis-read '' as the
// string ending early, corrupting everything parsed after it.
const esc = (v) => `$rgtxt$${String(v)}$rgtxt$`;
const rowsChanged = [];
const byIssuerOldNew = {};
const postStripDupes = {};   // issuer -> Map(newName -> [oldNames])

data.forEach(r => {
    const issuer = r[iIssuer].trim(), rawProduct = r[iProduct].trim(), cardId = r[iId].trim();
    const liveProduct = stripBrandV1(issuer, rawProduct);   // what's actually in the DB right now
    const newProduct = stripBrand(issuer, rawProduct);      // target
    if (newProduct === liveProduct) return;
    rowsChanged.push([cardId, liveProduct, newProduct]);
    (byIssuerOldNew[issuer] = byIssuerOldNew[issuer] || new Map()).set(liveProduct, newProduct);
});

// check for post-strip collisions (two different original names landing on the same stripped name)
Object.entries(byIssuerOldNew).forEach(([iss, m]) => {
    const byNew = {};
    m.forEach((newName, oldName) => (byNew[newName] = byNew[newName] || []).push(oldName));
    Object.entries(byNew).forEach(([newName, olds]) => { if (olds.length > 1) (postStripDupes[iss] = postStripDupes[iss] || []).push([newName, olds]); });
});

console.log('rows changed:', rowsChanged.length);
Object.entries(byIssuerOldNew).forEach(([iss, m]) => console.log(' ', iss, '-', m.size, 'distinct product names changed'));
if (Object.keys(postStripDupes).length) {
    console.log('\n⚠ post-strip name collisions (two different originals now identical):');
    Object.entries(postStripDupes).forEach(([iss, list]) => list.forEach(([n, olds]) => console.log('  ', iss, '"' + n + '" <-', olds.join(' | '))));
}

// ---- SQL: single atomic statement, matched by (issuer, product) not
// card_id — card_id in the live DB may no longer match this CSV export,
// but the product TEXT is still the join key we actually care about. ----
const pairRows = [];
Object.entries(byIssuerOldNew).forEach(([issuer, m]) => m.forEach((newName, oldName) => pairRows.push([issuer, oldName, newName])));

let sql = `-- ============================================================
-- Strips each issuer's own brand word out of product names (redundant with
-- the issuer column): "BOBCARD Corporate" -> "Corporate".
-- Matched by (issuer, product) — not card_id, so it's independent of
-- whatever card_id format is currently live.
-- Generated from cards_rows.csv — ${pairRows.length} distinct (issuer,product)
-- pairs, affecting ${rowsChanged.length} cards.
-- Single statement — paste this whole file and Run once. The final SELECT
-- reports how many rows were updated.
-- ============================================================

with map(issuer, old_product, new_product) as (
  values
${pairRows.map(([iss, o, n]) => `    (${esc(iss)}, ${esc(o)}, ${esc(n)})`).join(',\n')}
),
applied as (
  update cards c set product = m.new_product
  from map m
  where c.issuer = m.issuer and c.product = m.old_product
  returning 1
)
select count(*) as rows_updated from applied;
`;

fs.writeFileSync(path.join(ROOT, 'supabase', 'reorder_product_names.sql'), sql);
console.log('\nWritten: supabase/reorder_product_names.sql');

// ---- rebuild js/script1.js's ISSUER_PRODUCTS dropdown lists wholesale from
// CSV + stripBrand, not by diffing against whatever's currently there — a
// diff-based update can't self-correct a previous run's wrong output. ----
const byIssuerAll = {};
data.forEach(r => {
    const issuer = r[iIssuer].trim(), product = r[iProduct].trim();
    if (!issuer || !product) return;
    (byIssuerAll[issuer] = byIssuerAll[issuer] || new Set()).add(stripBrand(issuer, product));
});

let script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
Object.entries(byIssuerAll).forEach(([issuer, set]) => {
    const escRe = issuer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('"' + escRe + '":\\s*\\[([\\s\\S]*?)\\]');
    if (!re.test(script)) return;
    const updated = [...set].sort((a, b) => a.localeCompare(b));
    const replacement = `"${issuer}": [\n        ${updated.map(p => JSON.stringify(p)).join(', ')}\n    ]`;
    script = script.replace(re, replacement);
});
fs.writeFileSync(path.join(ROOT, 'js', 'script1.js'), script);
console.log('Updated ISSUER_PRODUCTS dropdown lists in js/script1.js');
