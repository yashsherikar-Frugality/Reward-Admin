/*
 * Blank import template: one sheet per WORKBOOK_SCHEMA entry, header row = the
 * project's mapped column names, plus one empty data row. Sheet names match the
 * schema so every import page picks up its own sheet.
 *
 *   npm i --no-save xlsx@0.18.5
 *   node scripts/make_template.js [out.xlsx]
 */
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'import_template.xlsx');

global.window = {};
require(path.join(ROOT, 'js', 'workbook_schema.js'));
const SCHEMA = global.window.WORKBOOK_SCHEMA;

const wb = XLSX.utils.book_new();
let n = 0;
Object.entries(SCHEMA).forEach(([name, def]) => {
    const ws = XLSX.utils.aoa_to_sheet([def.cols.slice(), def.cols.map(() => '')]);
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
    n++;
    console.log(`${name.trim().padEnd(26)} ${def.cols.length} cols  -> ${def.table}`);
});

XLSX.writeFile(wb, OUT);
console.log(`\n${n} sheets. Written: ${OUT}`);
