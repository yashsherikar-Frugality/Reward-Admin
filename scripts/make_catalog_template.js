/*
 * Import template that follows consolidated_fields_catalog-v5: one sheet per table, headers are the
 * catalog's column names, with Excel validation per column:
 *   - list columns  -> dropdown (values from the catalog's "Suggested Lists")
 *   - boolean       -> TRUE / FALSE dropdown
 *   - integer / numeric / date -> typed validation (numbers must be numbers, dates must be dates)
 * A "Column Guide" sheet lists every column's type and allowed values.
 *
 *   npm i --no-save exceljs
 *   node scripts/make_catalog_template.js [out.xlsx]
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'import_template_catalog_v5.xlsx');
global.window = {};
require(path.join(ROOT, 'js', 'schema_catalog.js'));
const { tables, lists } = window.SCHEMA_CATALOG;
const listFor = (t, c) => (lists.find((l) => l.t === t && l.col === c) || {}).items;
const SKIP = (c) => c === 'id' || c === 'created_at' || c === 'updated_at' || c === 'imported_at' || /_raw$/.test(c);

const wb = new ExcelJS.Workbook();
const guide = wb.addWorksheet('Column Guide');
guide.addRow(['Table', 'Column', 'Type', 'Allowed values']).font = { bold: true };

for (const [table, def] of Object.entries(tables)) {
    const cols = Object.keys(def.columns).filter((c) => !SKIP(c));
    if (!cols.length) continue;
    const ws = wb.addWorksheet(table.slice(0, 31));
    ws.addRow(cols).font = { bold: true };
    ws.views = [{ state: 'frozen', ySplit: 1 }];
    cols.forEach((c, i) => {
        const type = String(def.columns[c].type);
        const items = listFor(table, c);
        const L = ws.getColumn(i + 1);
        L.width = Math.max(14, c.length + 2);
        let dv = null, allowed = '';
        if (items && items.length) {
            const joined = items.join(',');
            dv = joined.length < 250
                ? { type: 'list', allowBlank: true, formulae: ['"' + items.map((v) => v.replace(/"/g, '""')).join(',') + '"'] }
                : null; // list too long for an inline Excel list; see Column Guide
            allowed = items.join(' | ');
        } else if (/^boolean/i.test(type)) {
            dv = { type: 'list', allowBlank: true, formulae: ['"TRUE,FALSE"'] }; allowed = 'TRUE | FALSE';
        } else if (/^(integer|bigint)/i.test(type)) {
            dv = { type: 'whole', operator: 'between', allowBlank: true, formulae: [-2147483648, 2147483647], showErrorMessage: true, errorTitle: 'Whole number', error: c + ' must be a whole number' };
        } else if (/^numeric/i.test(type)) {
            dv = { type: 'decimal', operator: 'between', allowBlank: true, formulae: [-1e12, 1e12], showErrorMessage: true, errorTitle: 'Number', error: c + ' must be a number (no currency symbols or text)' };
        } else if (/^date/i.test(type)) {
            dv = { type: 'date', operator: 'greaterThan', allowBlank: true, formulae: [new Date(1990, 0, 1)], showErrorMessage: true, errorTitle: 'Date', error: c + ' must be a date (YYYY-MM-DD)' };
        }
        if (dv) {
            dv.showErrorMessage = true;
            dv.errorTitle = dv.errorTitle || 'Pick from the list';
            dv.error = dv.error || 'Choose a value from the dropdown';
            for (let r = 2; r <= 1000; r++) ws.getCell(r, i + 1).dataValidation = dv;
        }
        guide.addRow([table, c, type, allowed]);
    });
}
guide.columns = [{ width: 28 }, { width: 38 }, { width: 18 }, { width: 100 }];
wb.xlsx.writeFile(OUT).then(() => console.log('wrote', OUT, '-', wb.worksheets.length - 1, 'sheets'));
