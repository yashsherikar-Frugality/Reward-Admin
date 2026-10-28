/*
 * Recomputes every existing card's ID under the new CheckKar-registry scheme
 * (ISSUER-NETWORK-PRODUCT-VARIANT-SEQ) from cards_rows.csv, then emits ONE sql
 * file that renames card_id everywhere it appears — cards, offers, mcc_rules,
 * the old card_benefits/benefit_milestones/benefit_partner_programs trio, and
 * every wb_* table.
 *
 *   node scripts/gen_card_id_rename.js "<folder with cards_rows.csv>" [out.sql]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = process.argv[2];
const OUT = process.argv[3] || path.join(ROOT, 'supabase', 'rename_card_ids.sql');
if (!SRC_DIR) { console.error('Usage: node scripts/gen_card_id_rename.js <folder with cards_rows.csv> [out.sql]'); process.exit(1); }

const script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
const grabObj = (n) => eval('(' + script.match(new RegExp('const ' + n + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\s*\\});'))[1] + ')');
const ISSUER_CODE = grabObj('ISSUER_CODE');
const NETWORK_CODE = grabObj('NETWORK_CODE');
const VARIANT_CODE = grabObj('VARIANT_CODE');
const PRODUCT_CODE = grabObj('PRODUCT_CODE');
const PRODUCT_CODE_OVERRIDE = grabObj('PRODUCT_CODE_OVERRIDE');

const issuerCode = (v) => {
    if (!v) return '';
    if (ISSUER_CODE[v]) return ISSUER_CODE[v];
    const ac = v.replace(/&/g, ' ').split(/\s+/).filter(Boolean).map(w => w[0]).join('').toUpperCase();
    return (ac.length >= 2 ? ac : v.replace(/[^A-Za-z0-9]/g, '').toUpperCase()).slice(0, 4);
};
const shortCode = (v, n = 3) => String(v || '').replace(/[^A-Za-z0-9]/g, '').slice(0, n).toUpperCase();
const networkCode = (v) => NETWORK_CODE[v] || shortCode(v, 3);
const variantCode = (v) => VARIANT_CODE[v] || shortCode(v, 3);
const PRODUCT_CODE_STOPWORDS = new Set(['CARD', 'CARDS', 'CREDIT']);
const productFallbackCode = (v) => {
    let words = String(v || '').split(/[^A-Za-z0-9]+/).filter(Boolean);
    while (words.length > 1 && PRODUCT_CODE_STOPWORDS.has(words[words.length - 1].toUpperCase())) words = words.slice(0, -1);
    if (!words.length) return '';
    if (words.length === 2) {
        const code2 = (words[0].toUpperCase().slice(0, 2) + words[1].toUpperCase().slice(0, 2)).replace(/[^A-Z0-9]/g, '');
        if (code2.length === 4) return code2;
    }
    let code = words[words.length - 1].toUpperCase().slice(0, 4);
    for (let i = words.length - 2; code.length < 4 && i >= 0; i--) code += words[i].toUpperCase();
    return code.replace(/[^A-Z0-9]/g, '').slice(0, 4) || shortCode(v, 4);
};
const productCode = (issuer, product) => PRODUCT_CODE_OVERRIDE[product] || (PRODUCT_CODE[issuer] && PRODUCT_CODE[issuer][product]) || productFallbackCode(product);
function dedupeProductCode(seen, issuer, network, product, code) {
    const scope = `${issuer}|${network}`.toLowerCase();
    let c = code, n = 2;
    while (seen[`${scope}|${c}`] && seen[`${scope}|${c}`] !== product) {
        c = code.slice(0, 3) + n;
        n++;
    }
    seen[`${scope}|${c}`] = product;
    return c;
}

// ---- parse cards_rows.csv ----
function parseCSV(text) {
    const rows = []; let row = []; let field = ''; let inQ = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQ) {
            if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
            else field += c;
        } else {
            if (c === '"') inQ = true;
            else if (c === ',') { row.push(field); field = ''; }
            else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
            else if (c === '\r') { }
            else field += c;
        }
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
}

const csv = fs.readFileSync(path.join(SRC_DIR, 'cards_rows.csv'), 'utf8');
const rows = parseCSV(csv);
const hdr = rows[0];
const idx = (name) => hdr.indexOf(name);
const iId = idx('card_id'), iIssuer = idx('issuer'), iProduct = idx('product'), iNetwork = idx('network'), iSub = idx('sub_network');
const data = rows.slice(1).filter(r => r.length === hdr.length && r[iId]);

// Same brand-word strip as gen_product_name_reorder.js — the card_id's product
// segment should reflect the product name as it'll actually read after that
// cleanup, not the old brand-prefixed text.
const BRAND_WORD = {
    'Axis Bank': ['Axis', 'AXIS'], 'Bank of Baroda': ['BOBCARD'], 'HDFC Bank': ['HDFC'],
    'ICICI Bank': ['ICICI'], 'IDFC FIRST Bank': ['FIRST'], 'Kotak Mahindra Bank': ['Kotak'],
    'RBL Bank': ['RBL'], 'SBI Card': ['SBI'], 'YES BANK': ['YES'],
};
// These 5 issuers' own name is "<word> Bank" — "Bank" leaks into product text
// right next to the brand word. Strip the two-word phrase as a unit, not a
// bare "Bank" everywhere (other issuers legitimately have other banks' full
// names as co-brand partners, e.g. "South Indian Bank SBI...").
const BRAND_PHRASE = {
    'Axis Bank': /\bAxis\s+Bank\b/gi, 'HDFC Bank': /\bHDFC\s+Bank\b/gi,
    'ICICI Bank': /\bICICI\s+Bank\b/gi, 'RBL Bank': /\bRBL\s+Bank\b/gi,
    'YES BANK': /\bYES\s+BANK\b/gi, 'SBI Card': /\bSBI\s+Card\b/gi,
};
// Universal cleanup, all issuers: a trailing "Credit Card" / "Card" is just
// noise ("Kwik Credit Card" -> "Kwik") — strip from the END only, never
// mid-string, so a genuinely meaningful "Card" elsewhere in a name survives.
const GENERIC_TRAILING = /\s+(Credit\s+Card|Cards|Card)$/i;
function stripGenericTrailing(text) {
    let t = text, prev;
    do { prev = t; t = t.replace(GENERIC_TRAILING, ''); } while (t !== prev);
    return t;
}
const stripBrand = (issuer, product) => {
    let text = product;
    if (BRAND_PHRASE[issuer]) text = text.replace(BRAND_PHRASE[issuer], ' ');
    const brands = BRAND_WORD[issuer];
    if (brands) text = text.split(/\s+/).filter(w => !brands.includes(w)).join(' ');
    text = stripGenericTrailing(text.replace(/\s{2,}/g, ' ').trim());
    const stripped = text.replace(/\s{2,}/g, ' ').trim();
    return stripped || product;
};

const seqByPrefix = {};
const seenProductCode = {};
const rowsOut = [];   // [issuer, product(as it reads live AFTER reorder_product_names.sql has run), network, sub, newId]
const auditRows = []; // [oldId(from this CSV export), newId, issuer, product, network, sub] -- every row, for the old/new audit CSV
let unchanged = 0;

data.forEach(r => {
    const oldId = r[iId].trim();
    const issuer = r[iIssuer].trim(), rawProduct = r[iProduct].trim(), network = r[iNetwork].trim(), sub = r[iSub].trim();
    const strippedProduct = stripBrand(issuer, rawProduct);
    const pCode = dedupeProductCode(seenProductCode, issuer, network, strippedProduct, productCode(issuer, strippedProduct));
    const prefix = [issuerCode(issuer), pCode, networkCode(network), variantCode(sub)].filter(Boolean).join('-') || 'CARD';
    seqByPrefix[prefix] = (seqByPrefix[prefix] || 0) + 1;
    const newId = `${prefix}-${String(seqByPrefix[prefix]).padStart(3, '0')}`;
    auditRows.push([oldId, newId, issuer, strippedProduct, network, sub]);
    if (newId === oldId) { unchanged++; return; }
    rowsOut.push([issuer, strippedProduct, network, sub, newId]);
});

console.log('cards read:', data.length, ' renamed:', rowsOut.length, ' already correct:', unchanged);

// ---- old/new audit CSV ----
const csvEsc = (v) => /[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
const auditCsv = ['old_card_id,new_card_id,issuer,product,network,sub_network']
    .concat(auditRows.map(r => r.map(csvEsc).join(',')))
    .join('\n') + '\n';
fs.writeFileSync(path.join(ROOT, 'supabase', 'card_id_rename_audit.csv'), auditCsv);
console.log('Written: supabase/card_id_rename_audit.csv', `(${auditRows.length} rows)`);

// ---- emit SQL ----
// Matched by (issuer, product, network, sub_network) — NOT card_id. A card_id
// in this CSV export may already be stale if an earlier rename ran against
// the live DB since this export was taken; the tuple match recovers the
// TRUE live card_id itself (via the `target` CTE below) instead of trusting
// a card_id value that may no longer exist.
// Dollar-quoted, not '...' with doubled apostrophes — a name like "Teacher's
// Platinum" needs 'Teacher''s Platinum', and some SQL-editor clients run a
// naive quote-toggling statement splitter that mis-reads '' as the string
// ending early, corrupting everything parsed after it in the same paste.
// $rgtxt$...$rgtxt$ has no single-quote character in it at all, so there's
// nothing for that kind of splitter to trip on.
const esc = (v) => `$rgtxt$${String(v)}$rgtxt$`;
const pairs = rowsOut;

const TABLES = [
    ['cards', 'card_id'],
    ['offers', 'card_id'],
    ['mcc_rules', 'card_id'],
    ['card_benefits', 'card_id'],
    ['benefit_milestones', 'card_id'],
    ['benefit_partner_programs', 'card_id'],
    ['wb_card_details', 'card_id'],
    ['wb_offers', 'card_id'],
    ['wb_mcc', 'card_id'],
    ['wb_lounge', 'card_id'], ['wb_airport_transfer', 'card_id'], ['wb_travel', 'card_id'],
    ['wb_hotel', 'card_id'], ['wb_airline', 'card_id'], ['wb_forex_international', 'card_id'],
    ['wb_reward_points', 'card_id'], ['wb_milestone', 'card_id'], ['wb_welcome', 'card_id'],
    ['wb_renewal_benefit', 'card_id'], ['wb_fee_waiver', 'card_id'], ['wb_partner_and_transfer', 'card_id'],
    ['wb_fuel', 'card_id'], ['wb_dining', 'card_id'], ['wb_golf', 'card_id'], ['wb_movie', 'card_id'],
    ['wb_spa_wellness', 'card_id'], ['wb_concierge', 'card_id'], ['wb_shopping', 'card_id'],
    ['wb_ott_subscription', 'card_id'], ['wb_insurance_protection', 'card_id'], ['wb_travel_insurance', 'card_id'],
    ['wb_purchase_protection', 'card_id'], ['wb_personal_accident', 'card_id'], ['wb_roadside_assistance', 'card_id'],
    ['wb_ltf_lifetime_free', 'card_id'], ['wb_status_benefits', 'card_id'], ['wb_upi', 'card_id'],
    ['wb_contactless', 'card_id'], ['wb_token_enabled', 'card_id'], ['wb_fees', 'card_id'],
];

// ---- Two things ruled out the earlier approaches:
// 1. Chained CTEs in ONE statement can't do a "temp then final" rename —
//    every CTE in a WITH clause reads the SAME snapshot, so a later CTE can
//    never see an earlier CTE's write, by any key. That's why that version
//    left every row stuck on "TMPRENAME_...".
// 2. Postgres also refuses a deferrable PK/unique constraint on a table that
//    something else has a foreign key pointing at ("cannot use a deferrable
//    unique constraint for referenced table"), so cards_pkey can't be made
//    deferrable while card_benefits/benefit_milestones/benefit_partner_programs
//    FK-reference it.
// The actual fix: separate SEQUENTIAL statements (not CTEs) DO see each
// other's writes — that's ordinary read-committed behaviour within one
// transaction. So: drop the 3 FKs -> rename the 39 other tables in one
// chained-CTE batch (safe: none of them have a uniqueness constraint on
// card_id, and they're matched while `cards` still holds the OLD values) ->
// rename `cards` itself via two separate statements, temp placeholder then
// final value (safe: each is its own statement, and "TMPRENAME_..." can't
// collide with any real old or new id) -> recreate the 3 FKs.
const CHILD_TABLES = TABLES.filter(([t]) => t !== 'cards');
let sql = `-- ============================================================
-- Renames every existing card_id to the new CheckKar-registry scheme
-- (ISSUER-PRODUCT-NETWORK-VARIANT-SEQ), everywhere it's referenced.
-- Generated from cards_rows.csv — ${pairs.length} cards actually change
-- (${unchanged} were already correctly formatted and are left alone).
-- Several separate statements, in order — paste this whole file and Run
-- once (Supabase's SQL editor runs multiple statements in one paste
-- sequentially, in the same transaction).
-- ============================================================

-- 0. One real table holding the map, used by every statement below so the
-- (issuer, product, network, sub_network, new_id) list is written ONCE,
-- not repeated per statement — a plain CTE can't be shared across separate
-- statements, but a real table persists across the whole transaction.
drop table if exists card_rename_map;
create table card_rename_map (issuer varchar, product varchar, network varchar, sub_network varchar, new_id varchar);
insert into card_rename_map (issuer, product, network, sub_network, new_id) values
${pairs.map(([iss, p, net, sub, n]) => `    (${esc(iss)}, ${esc(p)}, ${esc(net)}, ${esc(sub)}, ${esc(n)})`).join(',\n')};

-- 1. Drop the 3 FKs that point at cards_pkey, so cards and its children can
-- be renamed independently without a referential-integrity error mid-way.
alter table card_benefits drop constraint if exists card_benefits_card_id_fkey;
alter table benefit_milestones drop constraint if exists benefit_milestones_card_id_fkey;
alter table benefit_partner_programs drop constraint if exists benefit_partner_programs_card_id_fkey;

-- 2. Rename card_id in every OTHER table while "cards" still holds the old
-- values -- "target" is a plain SELECT (never written to), so this chained
-- batch is safe, and none of these 39 tables has a uniqueness constraint on
-- card_id to begin with.
-- A handful of distinct original products collapse to the identical
-- (issuer, product, network, sub_network) after the earlier text cleanup
-- ("ICICI Bank NRI Coral" and "...NRI Coral Credit Card" both -> "NRI
-- Coral"). A plain tuple join can't tell those rows apart and matches every
-- live row against every map row sharing that tuple — row_number() on both
-- sides, in the same deterministic order, pairs them 1:1 instead.
with target as (
  select c.card_id as old_id, m.new_id
  from (select *, row_number() over (partition by issuer, product, network, sub_network order by card_id) as rn from cards) c
  join (select *, row_number() over (partition by issuer, product, network, sub_network order by new_id) as rn from card_rename_map) m
    on c.issuer = m.issuer and c.product = m.product
    and c.network = m.network and c.sub_network = m.sub_network and c.rn = m.rn
)${CHILD_TABLES.map(([table, col], i) => `,
u${i + 1} as (
  update ${table} t set ${col} = tg.new_id
  from target tg
  where t.${col} = tg.old_id
  returning 1
)`).join('')}
select
  (select count(*) from target) as matched_cards,
${CHILD_TABLES.map(([table], i) => `  (select count(*) from u${i + 1})::int as ${table}`).join(',\n')};

-- 3. Rename cards.card_id itself, through a temp placeholder first. Matched
-- on (issuer, product, network, sub_network) plus the same row_number()
-- tie-break — not card_id — so this also doubles as the repair for
-- anything still stuck on "TMPRENAME_..." from the earlier broken attempt.
with target as (
  select c.card_id as old_id, m.new_id
  from (select *, row_number() over (partition by issuer, product, network, sub_network order by card_id) as rn from cards) c
  join (select *, row_number() over (partition by issuer, product, network, sub_network order by new_id) as rn from card_rename_map) m
    on c.issuer = m.issuer and c.product = m.product
    and c.network = m.network and c.sub_network = m.sub_network and c.rn = m.rn
)
update cards c set card_id = 'TMPRENAME_' || c.card_id
from target t
where c.card_id = t.old_id;

with target as (
  select c.card_id as old_id, m.new_id
  from (select *, row_number() over (partition by issuer, product, network, sub_network order by card_id) as rn from cards) c
  join (select *, row_number() over (partition by issuer, product, network, sub_network order by new_id) as rn from card_rename_map) m
    on c.issuer = m.issuer and c.product = m.product
    and c.network = m.network and c.sub_network = m.sub_network and c.rn = m.rn
)
update cards c set card_id = t.new_id
from target t
where c.card_id = t.old_id;

-- 4. Recreate the 3 FKs, exactly as they were.
alter table card_benefits add constraint card_benefits_card_id_fkey
  foreign key (card_id) references cards (card_id) on delete cascade;
alter table benefit_milestones add constraint benefit_milestones_card_id_fkey
  foreign key (card_id) references cards (card_id) on delete cascade;
alter table benefit_partner_programs add constraint benefit_partner_programs_card_id_fkey
  foreign key (card_id) references cards (card_id) on delete cascade;

drop table card_rename_map;
`;

fs.writeFileSync(OUT, sql);
console.log('Written:', OUT, `(${(sql.length / 1024).toFixed(0)} KB)`);
