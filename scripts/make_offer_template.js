/*
 * Offers import template with reward-type-aware columns.
 * One "Offers" sheet: base columns + rewardCap + every reward sub-field column.
 * Per row, the sub-field columns light up only for the chosen rewardType;
 * the rest grey out and reject input. Currency vs Points also toggles
 * Max Benefit / RP Expiry / Reward Cap / Apply Rule By / Apply Value.
 *
 *   npm i --no-save exceljs
 *   node scripts/make_offer_template.js [out.xlsx]
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'offer_template_final.xlsx');
const script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
const grab = (n) => eval(script.match(new RegExp('const ' + n + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'))[1]);
const grabObj = (n) => eval('(' + script.match(new RegExp('const ' + n + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\});'))[1] + ')');

const BASE = grab('OFFER_IMPORT_COLUMNS');            // cardId, offerId, category, ... customPlatform
const RTF = grabObj('REWARD_TYPE_FIELDS');
const CATS = ['ALL', ...Object.keys(grabObj('CATEGORY_HIERARCHY'))];

const CURRENCY = ['Cashback', 'Instant Discount', 'Variable Discount', 'Voucher'];
const POINTS = ['Reward Points', 'Air Miles', 'Hotel Points', 'Coins'];
const ALL_TYPES = [...CURRENCY, ...POINTS];

// base-column dropdowns (mirror the app)
const BASE_OPTS = {
    category: CATS,
    rewardType: ALL_TYPES,
    frequency: ['One Time', 'Monthly', 'Quarterly', 'Yearly'],
    status: ['Active', 'Inactive'],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Weekdays', 'Weekends', 'All Days'],
    instancePeriod: ['Per Transaction', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'],
    person: ['Primary', 'Family', 'Cardholder', 'Spouse', 'Children', 'All Members'],
    paymentScopeType: ['Category', 'Payment Mode', 'Location', 'Merchant'],
    rpExpiry: ['No Expiry', '12 Months', '24 Months', '36 Months', 'Custom'],
    platform: ['Zomato Gold', 'Smart Buy', 'Other'],
};

// full column list: base + rewardCap (after maxBenefit) + one column per reward sub-field
const subCols = [];                 // { col, type, opts }
Object.entries(RTF).forEach(([t, fields]) => fields.forEach(f => subCols.push({ col: f.id, type: t, opts: f.options })));

const columns = [];
BASE.forEach(c => {
    columns.push(c);
    if (c === 'maxBenefit') columns.push('rewardCap');
});
subCols.forEach(s => columns.push(s.col));

const N_ROWS = 200;
const colLetter = (i) => { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
const idx = (name) => columns.indexOf(name);
const RT_L = colLetter(idx('rewardType'));           // rewardType column letter
const rt = (r) => `$${RT_L}${r}`;

const wb = new ExcelJS.Workbook();

// hidden sheet for list ranges
const L = wb.addWorksheet('_lists');
L.state = 'veryHidden';
L.getCell('A1').value = '';                            // blank list -> "no valid entries" = blocked
wb.definedNames.add(`_lists!$A$1`, 'L_BLANK');
let lc = 1;
const putList = (name, arr) => {
    const c = colLetter(lc);
    arr.forEach((v, i) => { L.getCell(`${c}${i + 1}`).value = String(v); });
    wb.definedNames.add(`_lists!$${c}$1:$${c}$${arr.length}`, name);
    lc++;
    return name;
};
const rangeName = {};
Object.entries(BASE_OPTS).forEach(([k, v]) => { rangeName[k] = putList('OPT_' + k, v); });
subCols.forEach(s => { rangeName[s.col] = putList('OPT_' + s.col, s.opts); });

// Offers sheet
const ws = wb.addWorksheet('Offers');
ws.addRow(columns);
ws.getRow(1).font = { bold: true };
for (let r = 2; r <= N_ROWS; r++) ws.addRow(columns.map(() => ''));

// plain dropdowns on base columns
Object.keys(BASE_OPTS).forEach(k => {
    const c = colLetter(idx(k));
    for (let r = 2; r <= N_ROWS; r++) {
        ws.getCell(`${c}${r}`).dataValidation = { type: 'list', allowBlank: true, showDropDown: true, formulae: [rangeName[k]] };
    }
});

// reward sub-field columns: list is real only when rewardType matches, else blank (blocked) + grey
subCols.forEach(s => {
    const c = colLetter(idx(s.col));
    for (let r = 2; r <= N_ROWS; r++) {
        ws.getCell(`${c}${r}`).dataValidation = {
            type: 'list', allowBlank: true, showDropDown: true,
            formulae: [`IF(${rt(r)}="${s.type}",${rangeName[s.col]},L_BLANK)`],
            showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Not for this reward type',
            error: `This column applies only when Reward Type = "${s.type}".`,
        };
    }
    ws.addConditionalFormatting({
        ref: `${c}2:${c}${N_ROWS}`,
        rules: [{ type: 'expression', priority: 1, formulae: [`${rt(2)}<>"${s.type}"`],
            style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDDDDDD' } } } }],
    });
});

// currency / points column toggles (grey + block)
const isPoints = (r) => `OR(${POINTS.map(t => `${rt(r)}="${t}"`).join(',')})`;
const isCurrency = (r) => `OR(${CURRENCY.map(t => `${rt(r)}="${t}"`).join(',')})`;
const greyBlock = (colName, hideWhenFormula) => {
    const c = colLetter(idx(colName));
    const hasList = !!rangeName[colName];
    for (let r = 2; r <= N_ROWS; r++) {
        if (hasList) {
            // keep the dropdown, but the list is empty (blocked) when the column doesn't apply
            ws.getCell(`${c}${r}`).dataValidation = {
                type: 'list', allowBlank: true, showDropDown: true,
                showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Not applicable',
                error: 'This column does not apply to the selected Reward Type.',
                formulae: [`IF(${hideWhenFormula(r)},L_BLANK,${rangeName[colName]})`],
            };
        } else {
            // free-text column: custom formula blocks input when it doesn't apply
            ws.getCell(`${c}${r}`).dataValidation = {
                type: 'custom', allowBlank: true, showErrorMessage: true, errorStyle: 'stop',
                errorTitle: 'Not applicable', error: 'This column does not apply to the selected Reward Type.',
                formulae: [`NOT(${hideWhenFormula(r)})`],
            };
        }
    }
    ws.addConditionalFormatting({
        ref: `${c}2:${c}${N_ROWS}`,
        rules: [{ type: 'expression', priority: 1, formulae: [hideWhenFormula(2)],
            style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDDDDDD' } } } }],
    });
};

greyBlock('maxBenefit', isPoints);      // ₹ cap — currency only
greyBlock('rewardCap', isCurrency);     // points cap — points only
greyBlock('rpExpiry', isCurrency);      // RP expiry — points only
greyBlock('paymentScopeType', isCurrency);
greyBlock('paymentScopeValue', isCurrency);

wb.xlsx.writeFile(OUT).then(() => {
    console.log('columns:', columns.length);
    console.log('reward sub-field columns:', subCols.length);
    console.log('Written:', OUT);
});
