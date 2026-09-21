/*
 * FINAL all-in-one import template.
 *
 *  - Card Details : one row per card. Column A = a TEMP Card ID you assign
 *    (1,2,3 ... or "INFINIA-1"). Every benefit flag from the project wizard is a
 *    Yes/No dropdown; every controlled field is a dropdown.
 *  - Offers       : reward-type-aware columns (only the chosen type's sub-fields
 *    open). cardId must match a row in Card Details, else the cell is rejected
 *    and shaded pink.
 *  - One sheet per benefit (every checkbox in WIZARD_BENEFIT_GROUPS). Fields
 *    come from BENEFIT_DETAIL_SPEC / WIZARD_BENEFIT_MINI_SPEC (same resolution
 *    the app uses). If that card's benefit flag = "No" in Card Details, the
 *    whole row greys out and every cell rejects input.
 *  - MCC          : cardId matched to Card Details.
 *
 *   npm i --no-save exceljs
 *   node scripts/make_final_template.js [out.xlsx]
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'import_template_FINAL.xlsx');
const N = 100;

// ---- pull data straight out of the project source ----
const script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
const arrLit = (n) => script.match(new RegExp('const ' + n + '\\s*=\\s*(\\[[\\s\\S]*?\\n\\];)'))[1].replace(/;$/, '');
const objLit = (n) => script.match(new RegExp('const ' + n + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\};)'))[1].replace(/;$/, '');
const grab = (n) => eval(script.match(new RegExp('const ' + n + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'))[1]);
const grabObj = (n) => eval('(' + script.match(new RegExp('const ' + n + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\});'))[1] + ')');

const win = {}; (function (window) { eval(fs.readFileSync(path.join(ROOT, 'js', 'benefit_spec.js'), 'utf8')); })(win);
const VOCAB = win.BENEFIT_VOCAB || {};
const SPEC = win.BENEFIT_DETAIL_SPEC || {};
const MINI = eval('(' + objLit('WIZARD_BENEFIT_MINI_SPEC') + ')');
const SPEC_MAP = eval('(' + objLit('WIZARD_BENEFIT_SPEC_MAP') + ')');
const GROUPS = eval('(' + arrLit('WIZARD_BENEFIT_GROUPS') + ')');
const BENEFIT_IDS = GROUPS.flatMap(g => g.items.map(i => i[0]));   // every wizard checkbox

const CARD_COLS0 = grab('FIXED_COLUMNS').map(c => c.key);
const OFFER_BASE = grab('OFFER_IMPORT_COLUMNS');
const MCC_COLS = grab('MCC_IMPORT_COLUMNS');
const OPT = grabObj('IMPORT_VALID_OPTIONS');
const RTF = grabObj('REWARD_TYPE_FIELDS');
const NET = grabObj('NETWORKS');
const CATS = ['ALL', ...Object.keys(grabObj('CATEGORY_HIERARCHY'))];
const ISSUERS = Object.keys(grabObj('ISSUER_PRODUCTS'));
const COUNTRIES = grab('COUNTRIES');

// Card Details gets a Yes/No column for EVERY wizard benefit, not just the
// FIXED_COLUMNS subset, so every benefit sheet has a flag to look up.
const EXTRA_FLAGS = BENEFIT_IDS.filter(id => !CARD_COLS0.includes(id));
const CARD_COLS = [...CARD_COLS0, ...EXTRA_FLAGS];

const stripNet = (s, n) => (String(s).replace(new RegExp('\\b' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), '').replace(/\s{2,}/g, ' ').trim() || s);
const SUBNET_ALL = [...new Set([].concat(...Object.keys(NET).map(n => NET[n].map(s => stripNet(s, n)))))];

const CURRENCY = ['Cashback', 'Instant Discount', 'Variable Discount', 'Voucher'];
const POINTS = ['Reward Points', 'Air Miles', 'Hotel Points', 'Coins'];
const YN = ['Yes', 'No'];
const PERIOD = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'];

const colL = (i) => { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };

const wb = new ExcelJS.Workbook();
const L = wb.addWorksheet('_lists'); L.state = 'veryHidden';
L.getCell('A1').value = ''; wb.definedNames.add('_lists!$A$1', 'L_BLANK');
let lc = 1; const named = {};
const list = (name, arr) => {
    if (named[name]) return name;
    const c = colL(lc++);
    (arr.length ? arr : ['—']).forEach((v, i) => { L.getCell(`${c}${i + 1}`).value = String(v); });
    wb.definedNames.add(`_lists!$${c}$1:$${c}$${Math.max(arr.length, 1)}`, name);
    named[name] = 1; return name;
};

const sheet = (title, cols) => {
    const ws = wb.addWorksheet(title.replace(/[\\/?*[\]:]/g, '-').slice(0, 31));
    ws.addRow(cols); ws.getRow(1).font = { bold: true };
    ws.views = [{ state: 'frozen', ySplit: 1, xSplit: 1 }];
    for (let r = 2; r <= N; r++) ws.addRow(cols.map(() => ''));
    return ws;
};
const plainDD = (ws, cols, colName, opts) => {
    const i = cols.indexOf(colName); if (i < 0) return;
    const c = colL(i), nm = list('L_' + colName, opts);
    for (let r = 2; r <= N; r++) ws.getCell(`${c}${r}`).dataValidation = { type: 'list', allowBlank: true, showDropDown: true, formulae: [nm] };
};
const greyCF = (ws, cols, colName, whenRow2) => {
    const i = cols.indexOf(colName); if (i < 0) return null;
    const c = colL(i);
    ws.addConditionalFormatting({ ref: `${c}2:${c}${N}`, rules: [{ type: 'expression', priority: 1, formulae: [whenRow2], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDDDDDD' } } } }] });
    return c;
};
// cardId column must reference an existing Card Details row.
const cardIdGuard = (ws, colName) => {
    const i = ws.getRow(1).values.indexOf(colName) - 1; if (i < 0) return;
    const c = colL(i);
    for (let r = 2; r <= N; r++) ws.getCell(`${c}${r}`).dataValidation = {
        type: 'custom', allowBlank: true, showErrorMessage: true, errorStyle: 'stop',
        errorTitle: 'Unknown Card ID', error: 'This Card ID is not in the Card Details sheet.',
        formulae: [`COUNTIF('Card Details'!$A:$A,$${c}${r})>0`],
    };
    ws.addConditionalFormatting({
        ref: `${c}2:${c}${N}`,
        rules: [{ type: 'expression', priority: 1, formulae: [`AND($${c}2<>"",COUNTIF('Card Details'!$A:$A,$${c}2)=0)`], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFF8C9C9' } } } }],
    });
};

/* ===================== Card Details ===================== */
const cd = sheet('Card Details', CARD_COLS);
CARD_COLS.forEach(k => {
    if (k.startsWith('benefit_') || k === 'cobrand') plainDD(cd, CARD_COLS, k, YN);
    else if (OPT[k]) plainDD(cd, CARD_COLS, k, OPT[k]);
});
plainDD(cd, CARD_COLS, 'issuer', ISSUERS);
plainDD(cd, CARD_COLS, 'network', Object.keys(NET));
plainDD(cd, CARD_COLS, 'subNetwork', SUBNET_ALL);
plainDD(cd, CARD_COLS, 'issuerCountry', COUNTRIES);

/* ===================== Offers ===================== */
const OFFER_OPTS = {
    category: CATS, rewardType: [...CURRENCY, ...POINTS],
    frequency: ['One Time', 'Monthly', 'Quarterly', 'Yearly'],
    status: ['Active', 'Inactive'],
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Weekdays', 'Weekends', 'All Days'],
    instancePeriod: ['Per Transaction', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'],
    person: ['Primary', 'Family', 'Cardholder', 'Spouse', 'Children', 'All Members'],
    paymentScopeType: ['Category', 'Payment Mode', 'Location', 'Merchant'],
    rpExpiry: ['No Expiry', '12 Months', '24 Months', '36 Months', 'Custom'],
    platform: ['Zomato Gold', 'Smart Buy', 'Other'],
};
const subCols = [];
Object.entries(RTF).forEach(([t, fields]) => fields.forEach(f => subCols.push({ col: f.id, type: t, opts: f.options })));
const offerCols = [];
OFFER_BASE.forEach(c => { offerCols.push(c); if (c === 'maxBenefit') offerCols.push('rewardCap'); });
subCols.forEach(s => { if (!offerCols.includes(s.col)) offerCols.push(s.col); });
const off = sheet('Offers', offerCols);
const RT_L = colL(offerCols.indexOf('rewardType'));
const rtCell = (r) => `$${RT_L}${r}`;
Object.entries(OFFER_OPTS).forEach(([k, v]) => plainDD(off, offerCols, k, v));
cardIdGuard(off, 'cardId');

subCols.forEach(s => {
    const c = colL(offerCols.indexOf(s.col));
    const nm = list('L_' + s.col, s.opts || []);
    for (let r = 2; r <= N; r++) off.getCell(`${c}${r}`).dataValidation = {
        type: 'list', allowBlank: true, showDropDown: true,
        formulae: [`IF(${rtCell(r)}="${s.type}",${nm},L_BLANK)`],
        showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Wrong reward type',
        error: `Fill only when Reward Type = "${s.type}".`,
    };
    greyCF(off, offerCols, s.col, `${rtCell(2)}<>"${s.type}"`);
});
const isPts = (r) => `OR(${POINTS.map(t => `${rtCell(r)}="${t}"`).join(',')})`;
const isCur = (r) => `OR(${CURRENCY.map(t => `${rtCell(r)}="${t}"`).join(',')})`;
[['maxBenefit', isPts], ['rewardCap', isCur], ['rpExpiry', isCur], ['paymentScopeType', isCur], ['paymentScopeValue', isCur]].forEach(([col, when]) => {
    const c = greyCF(off, offerCols, col, when(2)); if (!c) return;
    for (let r = 2; r <= N; r++) {
        off.getCell(`${c}${r}`).dataValidation = OFFER_OPTS[col]
            ? { type: 'list', allowBlank: true, showDropDown: true, formulae: [`IF(${when(r)},L_BLANK,${list('L_' + col, OFFER_OPTS[col])})`], showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Not applicable', error: 'Does not apply to the selected Reward Type.' }
            : { type: 'custom', allowBlank: true, showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Not applicable', error: 'Does not apply to the selected Reward Type.', formulae: [`NOT(${when(r)})`] };
    }
});

/* ===================== Benefit sheets ===================== */
const BOOLISH = new Set(['room_upgrade', 'complimentary_night', 'breakfast_included', 'early_checkin', 'late_checkout', 'status_match',
    'boarding_pass_required', 'reservation_required', 'dine_in_only', 'tip_excluded', 'tax_excluded', 'lesson_available', 'caddie_included',
    'guest_allowed', 'automatic_waiver', 'partial_waiver_allowed', 'gst_reversal', 'dcc_supported', 'international_reward_eligible',
    'upi_enabled', 'merchant_transaction_eligible', 'p2p_eligible', 'international_support', 'booking_required', 'breakfast']);
const norm = (f) => {
    if (Array.isArray(f)) {
        const [id, kind, vk] = f;
        if (kind === 'bool') return { id, kind: 'bool' };
        return { id, kind: 'list', opts: Array.isArray(vk) ? vk : (VOCAB[vk] || []) };
    }
    if (BOOLISH.has(f)) return { id: f, kind: 'bool' };
    return { id: f, kind: 'text' };
};
// extra hand-coded panel fields the app added on top of the spec
const SHEET_EXTRAS = {
    benefit_lounge: [['lounge_usage_type', 'select', ['Card Swipe', 'Voucher', 'PP', 'Other', 'TBC']]],
    benefit_dining: [['dining_platform', 'select', ['Zomato', 'Swiggy', 'Merchant', 'Other']], 'dining_discount_value', 'dining_restaurant_mapping'],
    benefit_fuel: [['fuel_waiver_period', 'select', PERIOD], 'fuel_max_tx_count', ['fuel_count_period', 'select', ['Per Day', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']]],
    benefit_forex: ['forex_ccy_markup', 'conversion_charge'],
    benefit_ltf: ['notes'],
};

BENEFIT_IDS.forEach(id => {
    if (id === 'benefit_fees') return;                       // fees live on Card Details, not a benefit table
    const def = (SPEC_MAP[id] && SPEC[SPEC_MAP[id]]) || MINI[id] || { fields: ['notes'] };
    const label = (def.label || id.replace('benefit_', '').replace(/([A-Z])/g, ' $1'))
        .replace(/[\\/?*[\]:]/g, '-').replace(/\s{2,}/g, ' ').trim();
    const raw = [...(SHEET_EXTRAS[id] || []), ...(def.fields || [])];
    const seen = new Set(['cardId']);
    const fields = raw.map(norm).filter(f => !seen.has(f.id) && seen.add(f.id));
    const cols = ['cardId', ...fields.map(f => f.id)];
    const ws = sheet(label, cols);
    cardIdGuard(ws, 'cardId');

    const vcol = CARD_COLS.indexOf(id) + 1;                  // flag column in Card Details
    const noExpr = (r) => `IFERROR(VLOOKUP($A${r},'Card Details'!$A:$CV,${vcol},FALSE)="No",FALSE)`;
    const lastC = colL(cols.length - 1);
    ws.addConditionalFormatting({ ref: `B2:${lastC}${N}`, rules: [{ type: 'expression', priority: 1, formulae: [noExpr(2)], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDDDDDD' } } } }] });

    fields.forEach((f, fi) => {
        const c = colL(fi + 1);
        const opts = f.kind === 'bool' ? YN : (f.kind === 'list' ? f.opts : null);
        for (let r = 2; r <= N; r++) {
            ws.getCell(`${c}${r}`).dataValidation = opts && opts.length
                ? { type: 'list', allowBlank: true, showDropDown: true, formulae: [`IF(${noExpr(r)},L_BLANK,${list('L_b_' + f.id, opts)})`], showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Benefit = No', error: `${id} = No for this card in Card Details.` }
                : { type: 'custom', allowBlank: true, showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Benefit = No', error: `${id} = No for this card in Card Details.`, formulae: [`NOT(${noExpr(r)})`] };
        }
    });
});

/* ===================== MCC ===================== */
const mcc = sheet('MCC', MCC_COLS);
cardIdGuard(mcc, 'Card');

wb.xlsx.writeFile(OUT).then(() => {
    console.log('sheets:', wb.worksheets.map(w => w.name).filter(n => n !== '_lists').join(', '));
    console.log('benefit sheets:', BENEFIT_IDS.length - 1, ' card cols:', CARD_COLS.length, ' extra flags:', EXTRA_FLAGS.length);
    console.log('Written:', OUT);
});
