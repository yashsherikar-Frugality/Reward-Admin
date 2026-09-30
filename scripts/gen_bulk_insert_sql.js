/*
 * Reads every .xlsx in a folder (same template as import_template_FINAL.xlsx —
 * Card Details + Offers + MCC + benefit sheets), auto-generates a real Card ID
 * per card (ignoring whatever temp ID the sheet used), relinks every child row
 * (Offers/MCC/benefit sheets) to that new ID, and emits ONE .sql file:
 *   - TRUNCATE every table (wipes old data)
 *   - INSERT statements for everything in the folder
 *
 *   npm i --no-save xlsx@0.18.5
 *   node scripts/gen_bulk_insert_sql.js "<folder with .xlsx files>" [out.sql]
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = process.argv[2];
const OUT = process.argv[3] || path.join(ROOT, 'supabase', 'bulk_import.sql');
if (!SRC_DIR) { console.error('Usage: node scripts/gen_bulk_insert_sql.js <folder> [out.sql]'); process.exit(1); }

// ---- pull the same constants the app itself uses ----
const script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
const dbjs = fs.readFileSync(path.join(ROOT, 'js', 'db.js'), 'utf8');
const grab = (n) => eval(script.match(new RegExp('const ' + n + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'))[1]);
const grabObj = (n, src = script) => eval('(' + src.match(new RegExp('const ' + n + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\s*\\});'))[1] + ')');

const FIXED_COLUMNS = grab('FIXED_COLUMNS');
const OFFER_IMPORT_COLUMNS = grab('OFFER_IMPORT_COLUMNS');
const MCC_IMPORT_COLUMNS = grab('MCC_IMPORT_COLUMNS');
const REWARD_TYPE_FIELDS = grabObj('REWARD_TYPE_FIELDS');
const ISSUER_CODE = grabObj('ISSUER_CODE');
const NETWORK_CODE = grabObj('NETWORK_CODE');
const CARD_COL = grabObj('CARD_COL', dbjs);
const OFFER_COL = grabObj('OFFER_COL', dbjs);
window = {};
eval(fs.readFileSync(path.join(ROOT, 'js', 'workbook_schema.js'), 'utf8'));
const WORKBOOK_SCHEMA = window.WORKBOOK_SCHEMA;

const REWARD_SUB_IDS = [];
Object.values(REWARD_TYPE_FIELDS).forEach(fields => fields.forEach(f => REWARD_SUB_IDS.push(f.id)));

// ---- same card-id-generation algorithm as script1.js ----
const issuerCode = (v) => {
    if (!v) return '';
    if (ISSUER_CODE[v]) return ISSUER_CODE[v];
    const ac = v.replace(/&/g, ' ').split(/\s+/).filter(Boolean).map(w => w[0]).join('').toUpperCase();
    return ac.length >= 2 ? ac : v.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
};
const shortCode = (v, n = 3) => String(v || '').replace(/[^A-Za-z0-9]/g, '').slice(0, n).toUpperCase();
const networkCode = (v) => NETWORK_CODE[v] || shortCode(v, 3);

// ---- sql helpers ----
// Supabase's SQL Editor splits pasted text into statements at every semicolon,
// even ones inside a quoted value — a source cell like "...bookings; offer
// valid..." corrupts the paste. Swap embedded semicolons for a comma so the
// text stays readable but can't be mistaken for a statement boundary.
const esc = (v) => `'${String(v).replace(/;/g, ',').replace(/'/g, "''")}'`;
const sqlText = (v) => (v === undefined || v === null || String(v).trim() === '') ? esc('N/A') : esc(v);
const sqlNullable = (v) => (v === undefined || v === null || String(v).trim() === '') ? 'NULL' : esc(v);
const sqlBool = (v) => {
    const s = String(v == null ? '' : v).trim().toLowerCase();
    return ['true', 'yes', '1', 'y'].includes(s) ? 'true' : 'false';
};
const BOOL_CARD_COLS = new Set(['cobrand', ...FIXED_COLUMNS.map(c => c.key).filter(k => k.startsWith('benefit_'))]);

function insertBatch(table, cols, rows) {
    if (!rows.length) return '';
    const CHUNK = 200;
    let sql = '';
    for (let i = 0; i < rows.length; i += CHUNK) {
        const chunk = rows.slice(i, i + CHUNK);
        sql += `insert into ${table} (${cols.join(', ')}) values\n` +
            chunk.map(r => `  (${r.join(', ')})`).join(',\n') + ';\n';
    }
    return sql;
}

// ---- xlsx helpers ----
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
function sheetRows(wb, sheetName) {
    const ws = wb.Sheets[sheetName];
    if (!ws) return { headers: [], rows: [] };
    const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    const headers = (grid[0] || []).map(h => String(h).trim());
    const rows = grid.slice(1).filter(r => r.some(c => String(c ?? '').trim() !== ''));
    return { headers, rows };
}
function colGetter(headers) {
    const idx = {}; headers.forEach((h, i) => { idx[norm(h)] = i; });
    return (row, name) => { const i = idx[norm(name)]; return i === undefined ? '' : String(row[i] ?? '').trim(); };
}

// ================================================================
// Pass 1: every file's Card Details -> generate real IDs, build idMap
// ================================================================
const files = fs.readdirSync(SRC_DIR).filter(f => /\.xlsx?$/i.test(f));
if (!files.length) { console.error('No .xlsx files found in', SRC_DIR); process.exit(1); }

const seqByPrefix = {};
const cardRows = [];              // sql values for `cards`
const fileState = [];             // { file, wb, idMap }

files.forEach(file => {
    const wb = XLSX.readFile(path.join(SRC_DIR, file));
    const { headers, rows } = sheetRows(wb, 'Card Details');
    if (!rows.length) { console.warn('  (no Card Details rows in', file, ')'); fileState.push({ file, wb, idMap: {} }); return; }
    const g = colGetter(headers);
    const idMap = {};
    const cardIds = [];   // every real card_id generated for THIS file (for wildcard fan-out)

    rows.forEach(row => {
        const issuer = g(row, 'issuer'), product = g(row, 'product'), network = g(row, 'network');
        const tempId = g(row, 'id');
        const prefix = [issuerCode(issuer), shortCode(product, 3), networkCode(network)].filter(Boolean).join('-') || 'CARD';
        seqByPrefix[prefix] = (seqByPrefix[prefix] || 0) + 1;
        const newId = `${prefix}-${String(seqByPrefix[prefix]).padStart(4, '0')}`;
        cardIds.push(newId);
        if (tempId) idMap[tempId.toLowerCase()] = newId;
        idMap[[issuer, product, network].map(x => x.toLowerCase()).join('|')] = newId;

        const rec = {};
        FIXED_COLUMNS.forEach(({ key }) => { rec[key] = key === 'id' ? newId : g(row, key); });
        const cols = [], vals = [];
        FIXED_COLUMNS.forEach(({ key }) => {
            const col = key === 'id' ? 'card_id' : (CARD_COL[key] || key);
            cols.push(col);
            vals.push(BOOL_CARD_COLS.has(key) ? sqlBool(rec[key]) : sqlText(rec[key]));
        });
        cardRows.push({ cols, vals });
    });
    fileState.push({ file, wb, idMap, cardIds });
    console.log(file, '->', rows.length, 'cards, prefixes now:', Object.keys(seqByPrefix).length);
});

const cardCols = cardRows[0].cols;
const cardValRows = cardRows.map(r => r.vals);

// relink a card-id-bearing value using this file's idMap
function relink(idMap, rawId, issuer, product, network) {
    const byId = idMap[String(rawId || '').toLowerCase()];
    if (byId) return byId;
    if (issuer || product || network) {
        const byAttrs = idMap[[issuer, product, network].map(x => String(x || '').toLowerCase()).join('|')];
        if (byAttrs) return byAttrs;
    }
    return null;
}

// ================================================================
// Pass 2: Offers / MCC / every benefit sheet, per file
// ================================================================
let offerRows = [], offerCols = null;
let mccRows = [];
const wbTableRows = {};   // table -> { cols, rows: [vals] }
let fanOutCount = 0;

// A row whose card reference doesn't match any real card (e.g. "All Axis Cards",
// "ICICI-BANK-MCC-POLICY-MASTER") is a bank-wide rule — apply it to every card
// generated from THIS file rather than dropping it.
function resolveIds(idMap, cardIds, rawId, file, where) {
    const one = relink(idMap, rawId);
    if (one) return [one];
    fanOutCount++;
    console.warn(`  [fan-out] ${file} ${where} "${rawId}" -> all ${cardIds.length} cards in this file`);
    return cardIds;
}

fileState.forEach(({ file, wb, idMap, cardIds }) => {
    // ---- Offers ----
    {
        const { headers, rows } = sheetRows(wb, 'Offers');
        const g = colGetter(headers);
        rows.forEach(row => {
            const rf = {};
            REWARD_SUB_IDS.forEach(id => { const v = g(row, id); if (v) rf[id] = v; });
            resolveIds(idMap, cardIds, g(row, 'cardId'), file, 'offer ' + g(row, 'offerId')).forEach(newId => {
                const cols = [], vals = [];
                OFFER_IMPORT_COLUMNS.forEach(key => {
                    const col = OFFER_COL[key] || key.toLowerCase();
                    cols.push(col);
                    vals.push(sqlText(key === 'cardId' ? newId : g(row, key)));
                });
                cols.push('reward_fields'); vals.push(`${esc(JSON.stringify(rf))}::jsonb`);
                REWARD_SUB_IDS.forEach(id => { cols.push(id.toLowerCase()); vals.push(sqlNullable(g(row, id))); });
                if (!offerCols) offerCols = cols;
                offerRows.push(vals);
            });
        });
    }
    // ---- MCC ----
    {
        const { headers, rows } = sheetRows(wb, 'MCC');
        const g = colGetter(headers);
        rows.forEach(row => {
            resolveIds(idMap, cardIds, g(row, 'Card'), file, 'mcc').forEach(newId => {
                mccRows.push([sqlText(newId), sqlText(g(row, 'Offer ID')), sqlText(g(row, 'MCC')), sqlText(g(row, 'Inclusion')), sqlText(g(row, 'Exclusion'))]);
            });
        });
    }
    // ---- every benefit sheet the workbook schema knows about ----
    Object.entries(WORKBOOK_SCHEMA).forEach(([sheetName, def]) => {
        if (['Card Details', 'Offers', 'MCC'].includes(def.label)) return;
        if (!wb.Sheets[sheetName]) return;
        const { headers, rows } = sheetRows(wb, sheetName);
        if (!rows.length) return;
        const g = colGetter(headers);
        const idCol = def.cardIdCol === 'card' ? 'Card' : (def.cardIdCol === 'card_id' ? 'cardId' : 'cardId');
        if (!wbTableRows[def.table]) wbTableRows[def.table] = { cols: def.cols, rows: [] };
        rows.forEach(row => {
            resolveIds(idMap, cardIds, g(row, idCol), file, def.table).forEach(newId => {
                const vals = def.cols.map(c => (c === def.cardIdCol) ? sqlText(newId) : sqlNullable(g(row, c)));
                wbTableRows[def.table].rows.push(vals);
            });
        });
    });
});

console.log('\ncards:', cardValRows.length, ' offers:', offerRows.length, ' mcc:', mccRows.length,
    ' benefit tables:', Object.keys(wbTableRows).length, ' wildcard rows fanned out:', fanOutCount);

// ================================================================
// Emit SQL
// ================================================================
const allWbTables = Object.values(WORKBOOK_SCHEMA).map(d => d.table).filter((v, i, a) => a.indexOf(v) === i);
let sql = `-- ============================================================
-- Bulk import generated by scripts/gen_bulk_insert_sql.js
-- Source: ${SRC_DIR}
-- Files: ${files.join(', ')}
-- Wipes every table, then loads everything from those files with
-- freshly auto-generated Card IDs (ISSUER-VAR-NET-NNNN).
-- ============================================================

-- ---- wipe old data ----
truncate table card_benefits, benefit_milestones, benefit_partner_programs,
  offers, mcc_rules, cards${allWbTables.length ? ',\n  ' + allWbTables.join(', ') : ''} cascade;

-- ---- cards (${cardValRows.length} rows) ----
${insertBatch('cards', cardCols, cardValRows)}
-- ---- offers (${offerRows.length} rows) ----
${offerCols ? insertBatch('offers', offerCols, offerRows) : ''}
-- ---- mcc_rules (${mccRows.length} rows) ----
${insertBatch('mcc_rules', ['card_id', 'offer_id', 'mcc', 'inclusion', 'exclusion'], mccRows)}
`;

Object.entries(wbTableRows).forEach(([table, { cols, rows }]) => {
    sql += `-- ---- ${table} (${rows.length} rows) ----\n${insertBatch(table, cols, rows)}\n`;
});

fs.writeFileSync(OUT, sql);
console.log('\nWritten:', OUT, `(${(sql.length / 1024 / 1024).toFixed(1)} MB)`);
