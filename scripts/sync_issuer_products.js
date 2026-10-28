/*
 * Rebuilds ISSUER_PRODUCTS in js/script1.js for whichever banks have real
 * imported data, so the manual wizard's Variant dropdown always matches what's
 * actually in the database — fixes cases like "Eterna" (dropdown) vs "BOBCARD
 * ETERNA" (real data) being silently treated as two different products.
 * Only touches issuers present in cards_rows.csv; every other bank's
 * hand-curated list is left exactly as-is.
 *
 *   node scripts/sync_issuer_products.js "<folder with cards_rows.csv>"
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = process.argv[2];
if (!SRC_DIR) { console.error('Usage: node scripts/sync_issuer_products.js <folder with cards_rows.csv>'); process.exit(1); }

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
const iIssuer = hdr.indexOf('issuer'), iProduct = hdr.indexOf('product');
const data = rows.slice(1).filter(r => r.length === hdr.length && r[0]);

const byIssuer = {};
data.forEach(r => {
    const iss = r[iIssuer].trim(), prod = r[iProduct].trim();
    if (!iss || !prod) return;
    (byIssuer[iss] = byIssuer[iss] || new Set()).add(prod);
});

let script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
let changed = 0;
Object.entries(byIssuer).forEach(([issuer, set]) => {
    const list = [...set].sort((a, b) => a.localeCompare(b));
    const esc = issuer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('"' + esc + '":\\s*\\[[\\s\\S]*?\\]');
    if (!re.test(script)) { console.warn('  (no dropdown entry found for', issuer, '— skipped)'); return; }
    const replacement = `"${issuer}": [\n        ${list.map(p => JSON.stringify(p)).join(', ')}\n    ]`;
    script = script.replace(re, replacement);
    changed++;
    console.log(issuer.padEnd(22), '->', list.length, 'products');
});

fs.writeFileSync(path.join(ROOT, 'js', 'script1.js'), script);
console.log('\nUpdated', changed, 'issuer dropdown lists.');
