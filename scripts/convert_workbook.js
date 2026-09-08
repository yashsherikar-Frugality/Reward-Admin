/*
 * Rewrites HDFC_Credit_Cards_final.xlsx into an import-ready workbook whose
 * column headers are the project's field names (from js/workbook_schema.js).
 * Every sheet keeps its original name and every data row is carried over
 * positionally. Sheets not in the schema are copied through unchanged.
 *
 *   npm i --no-save xlsx@0.18.5
 *   node scripts/convert_workbook.js [source.xlsx] [out.xlsx]
 */
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const SRC = process.argv[2] || path.join(ROOT, 'HDFC_Credit_Cards_final.xlsx');
const OUT = process.argv[3] || path.join(ROOT, 'HDFC_mapped_for_import.xlsx');

global.window = {};
require(path.join(ROOT, 'js', 'workbook_schema.js'));
const SCHEMA = global.window.WORKBOOK_SCHEMA;

const src = XLSX.readFile(SRC);
const out = XLSX.utils.book_new();

let mapped = 0, copied = 0;
src.SheetNames.forEach((name) => {
    const ws = src.Sheets[name];
    const grid = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    const def = SCHEMA[name];

    if (def) {
        // header row = project field names; data rows re-aligned to that width
        const rows = [def.cols.slice()];
        for (let r = 1; r < grid.length; r++) {
            const row = grid[r] || [];
            if (row.every((c) => c === '' || c == null)) continue;
            rows.push(def.cols.map((_, i) => (row[i] == null ? '' : row[i])));
        }
        XLSX.utils.book_append_sheet(out, XLSX.utils.aoa_to_sheet(rows), name.slice(0, 31));
        mapped++;
        console.log(`mapped  ${name.trim().padEnd(26)} ${rows.length - 1} rows / ${def.cols.length} cols -> ${def.table}`);
    } else {
        XLSX.utils.book_append_sheet(out, XLSX.utils.aoa_to_sheet(grid), name.slice(0, 31));
        copied++;
        console.log(`copied  ${name.trim().padEnd(26)} (not in project schema)`);
    }
});

XLSX.writeFile(out, OUT);
console.log(`\n${mapped} sheets mapped, ${copied} copied through.`);
console.log(`Written: ${OUT}`);
