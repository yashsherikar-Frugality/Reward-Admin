/*
 * FINAL all-in-one import template.
 *  - Card Details: benefit_* = Yes/No dropdowns + every controlled list
 *  - Offers: reward-type-aware columns (only the chosen type's sub-fields open)
 *  - One sheet per benefit with its current fields + dropdowns; a card row greys
 *    out on a benefit sheet when that benefit is "No" in Card Details
 *  - MCC
 *
 *   npm i --no-save exceljs
 *   node scripts/make_final_template.js [out.xlsx]
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'import_template_FINAL.xlsx');
const script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
const grab = (n) => eval(script.match(new RegExp('const ' + n + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'))[1]);
const grabObj = (n) => eval('(' + script.match(new RegExp('const ' + n + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\});'))[1] + ')');

const CARD_COLS = grab('FIXED_COLUMNS').map(c => c.key);
const OFFER_BASE = grab('OFFER_IMPORT_COLUMNS');
const MCC_COLS = grab('MCC_IMPORT_COLUMNS');
const OPT = grabObj('IMPORT_VALID_OPTIONS');
const RTF = grabObj('REWARD_TYPE_FIELDS');
const NET = grabObj('NETWORKS');
const CATS = ['ALL', ...Object.keys(grabObj('CATEGORY_HIERARCHY'))];
const ISSUERS = Object.keys(grabObj('ISSUER_PRODUCTS'));
const COUNTRIES = grab('COUNTRIES');

const stripNet = (s, n) => (String(s).replace(new RegExp('\\b' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), '').replace(/\s{2,}/g, ' ').trim() || s);
const SUBNET_ALL = [...new Set([].concat(...Object.keys(NET).map(n => NET[n].map(s => stripNet(s, n)))))];

const CURRENCY = ['Cashback', 'Instant Discount', 'Variable Discount', 'Voucher'];
const POINTS = ['Reward Points', 'Air Miles', 'Hotel Points', 'Coins'];
const YN = ['Yes', 'No'];
const PERIOD = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'];

const N = 200;
const colL = (i) => { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };

const wb = new ExcelJS.Workbook();
const L = wb.addWorksheet('_lists'); L.state = 'veryHidden';
L.getCell('A1').value = ''; wb.definedNames.add('_lists!$A$1', 'L_BLANK');
let lc = 1;
const named = {};
const list = (name, arr) => {
    if (named[name]) return named[name];
    const c = colL(lc++);
    arr.forEach((v, i) => { L.getCell(`${c}${i + 1}`).value = String(v); });
    wb.definedNames.add(`_lists!$${c}$1:$${c}$${arr.length}`, name);
    return (named[name] = name);
};

const sheet = (title, cols) => {
    const ws = wb.addWorksheet(title);
    ws.addRow(cols);
    ws.getRow(1).font = { bold: true };
    for (let r = 2; r <= N; r++) ws.addRow(cols.map(() => ''));
    return ws;
};
const dd = (ws, colName, cols, opts, { multi = false } = {}) => {   // plain list dropdown
    const i = cols.indexOf(colName); if (i < 0) return;
    const c = colL(i), nm = list('L_' + colName, opts);
    for (let r = 2; r <= N; r++) ws.getCell(`${c}${r}`).dataValidation = { type: 'list', allowBlank: true, showDropDown: true, formulae: [nm] };
};

// ---------- Card Details ----------
const cdCols = [...CARD_COLS];
const cd = sheet('Card Details', cdCols);
CARD_COLS.forEach(k => {
    if (k.startsWith('benefit_') || k === 'cobrand') dd(cd, k, cdCols, YN);
    else if (OPT[k]) dd(cd, k, cdCols, OPT[k]);
});
dd(cd, 'issuer', cdCols, ISSUERS);
dd(cd, 'network', cdCols, Object.keys(NET));
dd(cd, 'subNetwork', cdCols, SUBNET_ALL);
dd(cd, 'issuerCountry', cdCols, COUNTRIES);

// ---------- Offers (reward-type aware) ----------
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
subCols.forEach(s => offerCols.push(s.col));
const off = sheet('Offers', offerCols);
const RT_L = colL(offerCols.indexOf('rewardType'));
const rtCell = (r) => `$${RT_L}${r}`;
Object.entries(OFFER_OPTS).forEach(([k, v]) => dd(off, k, offerCols, v));
const grey = (ws, cols, colName, whenExpr) => {
    const i = cols.indexOf(colName); if (i < 0) return;
    const c = colL(i);
    ws.addConditionalFormatting({ ref: `${c}2:${c}${N}`, rules: [{ type: 'expression', priority: 1, formulae: [whenExpr(2)], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDDDDDD' } } } }] });
    return c;
};
subCols.forEach(s => {
    const c = colL(offerCols.indexOf(s.col));
    const nm = list('L_' + s.col, s.opts);
    for (let r = 2; r <= N; r++) off.getCell(`${c}${r}`).dataValidation = {
        type: 'list', allowBlank: true, showDropDown: true,
        formulae: [`IF(${rtCell(r)}="${s.type}",${nm},L_BLANK)`],
        showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Not for this reward type',
        error: `Fill only when Reward Type = "${s.type}".`,
    };
    grey(off, offerCols, s.col, (r) => `${rtCell(r)}<>"${s.type}"`);
});
const isPts = (r) => `OR(${POINTS.map(t => `${rtCell(r)}="${t}"`).join(',')})`;
const isCur = (r) => `OR(${CURRENCY.map(t => `${rtCell(r)}="${t}"`).join(',')})`;
[['maxBenefit', isPts], ['rewardCap', isCur], ['rpExpiry', isCur], ['paymentScopeType', isCur], ['paymentScopeValue', isCur]].forEach(([col, when]) => {
    const c = grey(off, offerCols, col, when);
    for (let r = 2; r <= N; r++) {
        off.getCell(`${c}${r}`).dataValidation = OFFER_OPTS[col]
            ? { type: 'list', allowBlank: true, showDropDown: true, formulae: [`IF(${when(r)},L_BLANK,${list('L_' + col, OFFER_OPTS[col])})`], showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Not applicable', error: 'Does not apply to the selected Reward Type.' }
            : { type: 'custom', allowBlank: true, showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Not applicable', error: 'Does not apply to the selected Reward Type.', formulae: [`NOT(${when(r)})`] };
    }
});

// ---------- Benefit sheets ----------
const B = {
    Lounge: { flag: 'benefit_lounge', cols: ['cardId', 'lounge_program', 'lounge_usage_type', 'lounge_dom_visits', 'lounge_dom_period', 'lounge_dom_frequency', 'lounge_dom_criteria', 'lounge_int_visits', 'lounge_int_period', 'lounge_int_frequency', 'lounge_int_criteria'],
        drop: { lounge_program: ['All', 'Priority Pass', 'DreamFolks', 'LoungeKey', 'Visa Airport Companion', 'Mastercard Airport Experiences', 'DragonPass'], lounge_usage_type: ['Card Swipe', 'Voucher', 'PP', 'Other', 'TBC'], lounge_dom_period: PERIOD, lounge_int_period: PERIOD } },
    Golf: { flag: 'benefit_golf', cols: ['cardId', 'golf_courses', 'golf_rounds', 'golf_period', 'golf_notes'],
        drop: { golf_courses: ['DLF Golf', 'Prestige Golfshire', 'KGA', 'Oxford Golf', 'Jaypee Greens', 'All Partner Courses'], golf_period: PERIOD } },
    Dining: { flag: 'benefit_dining', cols: ['cardId', 'dining_platform', 'dining_partner', 'dining_discount_type', 'dining_discount_value', 'dining_max_discount', 'dining_frequency', 'dining_min_spend', 'dining_restaurant_mapping', 'dining_notes'],
        drop: { dining_platform: ['Zomato', 'Swiggy', 'Merchant', 'Other'] } },
    Movie: { flag: 'benefit_movie', cols: ['cardId', 'movie_partner', 'movie_discount_type', 'movie_max_discount', 'movie_frequency', 'movie_ticket_limit', 'movie_days', 'movie_notes'], drop: {} },
    Spa: { flag: 'benefit_spa', cols: ['cardId', 'spa_partner', 'spa_discount', 'spa_max_discount', 'spa_frequency', 'spa_notes'], drop: {} },
    Concierge: { flag: 'benefit_concierge', cols: ['cardId', 'concierge_notes'], drop: {} },
    Insurance: { flag: 'benefit_insurance', cols: ['cardId', 'ins_provider', 'ins_coverage', 'ins_policyLink'], drop: {} },
    'Fee Waiver': { flag: 'benefit_feeWaiver', cols: ['cardId', 'fee_waiver_spend', 'fee_waiver_period'],
        drop: { fee_waiver_period: OPT.fee_waiver_period || PERIOD } },
    Fuel: { flag: 'benefit_fuel', cols: ['cardId', 'fuel_rate', 'fuel_max_waiver', 'fuel_waiver_period', 'fuel_min_tx', 'fuel_max_tx', 'fuel_max_tx_count', 'fuel_count_period'],
        drop: { fuel_waiver_period: PERIOD, fuel_count_period: ['Per Day', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'] } },
    Welcome: { flag: 'benefit_welcome', cols: ['cardId', 'welcome_value', 'welcome_benefit_type', 'welcome_free_text'],
        drop: { welcome_benefit_type: OPT.welcome_benefit_type || ['Voucher', 'Rs', 'RP', 'Cashback'] } },
    Milestone: { flag: 'benefit_milestone', cols: ['cardId', 'slab_no', 'milestone_amount', 'milestone_period', 'milestone_benefit_value', 'milestone_benefit_type', 'milestone_benefit_comment'],
        drop: { milestone_period: PERIOD, milestone_benefit_type: ['Voucher', 'Reward points', 'Cashback', 'Air miles', 'Membership', 'Fee waiver', 'Gift', 'Bonus points'] } },
    'Partner Program': { flag: 'benefit_partnerProgram', cols: ['cardId', 'partner_no', 'redemption_mode', 'partner_name', 'conversion_ratio', 'minimum_transfer', 'transfer_increment', 'transfer_fee', 'transfer_time', 'notes'],
        drop: { redemption_mode: ['Cashback (1 : 0.25 RP)', 'Voucher (1 : 0.5 RP)', 'Travel / Hotel — Partner (1 : 1 RP)', 'Travel / Hotel — Others (1 : 0.5 RP)', 'Miles — KrisFlyer (1 : 1)', 'Miles — Accor (1 : 1.2)', 'Miles — Others (1 : 0.75)', 'Other'] } },
    Hotel: { flag: 'benefit_partnerProgram', cols: ['cardId', 'hotel_sub_benefits', 'hotel_partner', 'hotel_program', 'discount_percent', 'room_upgrade', 'complimentary_night', 'breakfast_included', 'early_checkin', 'late_checkout', 'status_match', 'eligible_properties', 'blackout_dates'],
        drop: { hotel_program: ['Marriott Bonvoy', 'Hilton Honors', 'IHG One Rewards', 'Accor ALL', 'World of Hyatt', 'Taj InnerCircle', 'Club ITC', 'Radisson Rewards'], hotel_sub_benefits: ['Room Upgrade', 'Complimentary Night', 'Breakfast', 'Early Check-in', 'Late Check-out', 'Airport Transfer', 'Travel Credit', 'Dining Credit', 'Spa Credit', 'Loyalty Points', 'Status Match', 'Lounge Access', 'Travel Concierge', 'Other'], room_upgrade: YN, complimentary_night: YN, breakfast_included: YN, early_checkin: YN, late_checkout: YN, status_match: YN } },
    Forex: { flag: 'benefit_forex', cols: ['cardId', 'forex_ccy_markup', 'conversion_charge'], drop: {} },
    LTF: { flag: 'benefit_ltf', cols: ['cardId', 'notes'], drop: {} },
};

const CARD_FLAG_COL = (flag) => CARD_COLS.indexOf(flag) + 1;   // VLOOKUP col in Card Details

Object.entries(B).forEach(([name, def]) => {
    const ws = sheet(name, def.cols);
    Object.entries(def.drop).forEach(([col, opts]) => dd(ws, col, def.cols, opts));
    // grey + block whole row when this benefit is "No" for the card
    const vcol = CARD_FLAG_COL(def.flag);
    const lastL = colL(def.cols.length - 1);
    const look = (r) => `VLOOKUP($A${r},'Card Details'!$A:$BZ,${vcol},FALSE)="No"`;
    ws.addConditionalFormatting({ ref: `B2:${lastL}${N}`, rules: [{ type: 'expression', priority: 1, formulae: [look(2)], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDDDDDD' } } } }] });
    for (let r = 2; r <= N; r++) {
        for (let ci = 1; ci < def.cols.length; ci++) {
            const cell = ws.getCell(`${colL(ci)}${r}`);
            if (cell.dataValidation && cell.dataValidation.type === 'list') {
                cell.dataValidation.formulae = [`IF(${look(r)},L_BLANK,${cell.dataValidation.formulae[0]})`];
                cell.dataValidation.showErrorMessage = true; cell.dataValidation.errorStyle = 'stop';
                cell.dataValidation.errorTitle = 'Benefit not available';
                cell.dataValidation.error = `${def.flag} = No for this card in Card Details.`;
            } else {
                cell.dataValidation = { type: 'custom', allowBlank: true, showErrorMessage: true, errorStyle: 'stop', errorTitle: 'Benefit not available', error: `${def.flag} = No for this card in Card Details.`, formulae: [`NOT(${look(r)})`] };
            }
        }
    }
});

// ---------- MCC ----------
sheet('MCC', MCC_COLS);

wb.xlsx.writeFile(OUT).then(() => {
    console.log('sheets:', wb.worksheets.map(w => w.name).filter(n => n !== '_lists').join(', '));
    console.log('Written:', OUT);
});
