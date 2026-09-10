/*
 * Original-structure import template WITH Excel dropdowns on the Card Details
 * sheet (benefit_* = Yes/No, plus the app's other controlled lists).
 * Other sheets are plain header rows.
 *
 *   npm i --no-save exceljs xlsx@0.18.5
 *   node scripts/make_template_dropdowns.js [out.xlsx]
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'import_template_dropdowns.xlsx');
const script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
const grab = (n) => eval(script.match(new RegExp('const ' + n + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'))[1]);
const grabObj = (n) => eval('(' + script.match(new RegExp('const ' + n + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\});'))[1] + ')');

const CARD_COLS = grab('FIXED_COLUMNS').map((c) => c.key);
const OFFER_COLS = grab('OFFER_IMPORT_COLUMNS');
const MCC_COLS = grab('MCC_IMPORT_COLUMNS');
const OPT = grabObj('IMPORT_VALID_OPTIONS');
const ISSUERS = Object.keys(grabObj('ISSUER_PRODUCTS'));
const NETWORKS_OBJ = grabObj('NETWORKS');
const NETWORKS = Object.keys(NETWORKS_OBJ);
const COUNTRIES = grab('COUNTRIES');

// Sub-network list with the network word stripped ("Mastercard Platinum" -> "Platinum").
const stripNet = (sub, net) => (String(sub).replace(new RegExp('\\b' + net.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), '').replace(/\s{2,}/g, ' ').trim() || sub);
const SUBNET_ALL = [...new Set([].concat(...NETWORKS.map((n) => NETWORKS_OBJ[n].map((s) => stripNet(s, n)))))];

// benefit_* -> Yes/No ; the rest from IMPORT_VALID_OPTIONS / catalogs
const cardValidations = {};
CARD_COLS.forEach((c) => {
    if (c.startsWith('benefit_')) cardValidations[c] = ['Yes', 'No'];
    else if (OPT[c]) cardValidations[c] = OPT[c];
});
cardValidations.issuer = ISSUERS;
cardValidations.network = NETWORKS;
cardValidations.subNetwork = SUBNET_ALL;
cardValidations.issuerCountry = COUNTRIES;
cardValidations.cobrand = ['Yes', 'No'];

const BENEFIT_SHEETS = {
    Lounge: ['cardId', 'lounge_program', 'lounge_dom_visits', 'lounge_dom_period', 'lounge_dom_frequency', 'lounge_dom_criteria', 'lounge_int_visits', 'lounge_int_period', 'lounge_int_frequency', 'lounge_int_criteria'],
    Golf: ['cardId', 'golf_courses', 'golf_rounds', 'golf_period', 'golf_notes'],
    Dining: ['cardId', 'dining_partner', 'dining_discount_type', 'dining_max_discount', 'dining_frequency', 'dining_min_spend', 'dining_notes'],
    Movie: ['cardId', 'movie_partner', 'movie_discount_type', 'movie_max_discount', 'movie_frequency', 'movie_ticket_limit', 'movie_days', 'movie_notes'],
    Spa: ['cardId', 'spa_partner', 'spa_discount', 'spa_max_discount', 'spa_frequency', 'spa_notes'],
    Concierge: ['cardId', 'concierge_notes'],
    Insurance: ['cardId', 'ins_provider', 'ins_coverage', 'ins_policyLink'],
    'Fee Waiver': ['cardId', 'fee_waiver_spend', 'fee_waiver_period'],
    Fuel: ['cardId', 'fuel_rate', 'fuel_max_waiver', 'fuel_period', 'fuel_min_tx', 'fuel_max_tx'],
    Welcome: ['cardId', 'welcome_value', 'welcome_benefit_type', 'welcome_free_text'],
    Milestone: ['cardId', 'slab_no', 'milestone_amount', 'milestone_period', 'milestone_benefit_value', 'milestone_benefit_type', 'milestone_benefit_comment'],
    'Partner Program': ['cardId', 'partner_no', 'partner_program', 'partner_ratio', 'partner_minTransfer', 'partner_transferTime'],
};

const colLetter = (i) => {
    let s = '';
    i++;
    while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); }
    return s;
};

const wbk = new ExcelJS.Workbook();

// Hidden sheet holding long lists we reference by range.
const listSheet = wbk.addWorksheet('_lists');
listSheet.state = 'veryHidden';
const listRanges = {};
let listCol = 0;
const putList = (name, arr) => {
    const L = colLetter(listCol);
    arr.forEach((v, r) => { listSheet.getCell(`${L}${r + 1}`).value = String(v); });
    listRanges[name] = `_lists!$${L}$1:$${L}$${arr.length}`;
    listCol++;
};

const plainSheet = (name, cols) => {
    const ws = wbk.addWorksheet(name);
    ws.addRow(cols);
    ws.addRow(cols.map(() => ''));
    ws.getRow(1).font = { bold: true };
};

// --- Card Details with validations ---
const cd = wbk.addWorksheet('Card Details');
cd.addRow(CARD_COLS);
cd.addRow(CARD_COLS.map(() => ''));
cd.getRow(1).font = { bold: true };
CARD_COLS.forEach((c, i) => {
    const opts = cardValidations[c];
    if (!opts || !opts.length) return;
    const L = colLetter(i);
    let formulae;
    const inline = '"' + opts.join(',') + '"';
    if (inline.length <= 255) formulae = [inline];
    else { putList(c, opts); formulae = [listRanges[c]]; }
    for (let r = 2; r <= 300; r++) {
        cd.getCell(`${L}${r}`).dataValidation = {
            type: 'list', allowBlank: true, showDropDown: true, formulae,
        };
    }
});

plainSheet('Offers', OFFER_COLS);

// benefit sheet name -> its benefit_* flag column in Card Details (VLOOKUP col, 1-based)
const SHEET_BENEFIT_FLAG = {
    Lounge: 'benefit_lounge', Golf: 'benefit_golf', Dining: 'benefit_dining', Movie: 'benefit_movie',
    Spa: 'benefit_spa', Concierge: 'benefit_concierge', Insurance: 'benefit_insurance',
    'Fee Waiver': 'benefit_feeWaiver', Fuel: 'benefit_fuel', Welcome: 'benefit_welcome',
    Milestone: 'benefit_milestone', 'Partner Program': 'benefit_partnerProgram',
};
const N_ROWS = 200;

Object.entries(BENEFIT_SHEETS).forEach(([name, cols]) => {
    const ws = wbk.addWorksheet(name);
    ws.addRow(cols);
    ws.addRow(cols.map(() => ''));
    ws.getRow(1).font = { bold: true };

    const flag = SHEET_BENEFIT_FLAG[name];
    if (!flag) return;
    const vcol = CARD_COLS.indexOf(flag) + 1;                    // column no. in Card Details
    const lastL = colLetter(cols.length - 1);
    const dataRange = `B2:${lastL}${N_ROWS}`;
    const lookup = (r) => `VLOOKUP($A${r},'Card Details'!$A:$BZ,${vcol},FALSE)`;

    // grey fill when Card Details has this benefit = No
    ws.addConditionalFormatting({
        ref: dataRange,
        rules: [{
            type: 'expression', priority: 1,
            formulae: [`${lookup(2)}="No"`],
            style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDDDDDD' } } },
        }],
    });

    // block typing in those cells (custom validation fails when benefit = No)
    for (let r = 2; r <= N_ROWS; r++) {
        for (let ci = 1; ci < cols.length; ci++) {
            ws.getCell(`${colLetter(ci)}${r}`).dataValidation = {
                type: 'custom', allowBlank: true, showErrorMessage: true, errorStyle: 'stop',
                errorTitle: 'Benefit disabled',
                error: `This card has ${flag} = No in Card Details, so this row is not applicable.`,
                formulae: [`${lookup(r)}<>"No"`],
            };
        }
    }
});

plainSheet('MCC', MCC_COLS);

wbk.xlsx.writeFile(OUT).then(() => {
    console.log('Card Details dropdowns:', Object.keys(cardValidations).length, 'columns');
    console.log('Benefit sheets locked-when-No:', Object.keys(SHEET_BENEFIT_FLAG).length);
    console.log('Written:', OUT);
});
