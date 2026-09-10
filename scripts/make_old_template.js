/*
 * Import template matching the ORIGINAL Import From Excel structure.
 * 4 sheets: Card Details, Offers, Preferred Benefits, MCC.
 * Headers pulled straight from script1.js (FIXED_COLUMNS / OFFER_IMPORT_COLUMNS /
 * MCC_IMPORT_COLUMNS) so the multi-sheet importer recognises every sheet.
 *
 *   npm i --no-save xlsx@0.18.5
 *   node scripts/make_old_template.js [out.xlsx]
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'import_template_old.xlsx');
const src = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');

const grab = (name) => {
    const m = src.match(new RegExp('const ' + name + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'));
    if (!m) throw new Error('not found: ' + name);
    return eval(m[1]);
};

const FIXED_COLUMNS = grab('FIXED_COLUMNS');
const OFFER_IMPORT_COLUMNS = grab('OFFER_IMPORT_COLUMNS');
const MCC_IMPORT_COLUMNS = grab('MCC_IMPORT_COLUMNS');

const cardCols = FIXED_COLUMNS.map((c) => c.key);

// Preferred Benefits — one sheet PER benefit. Each carries cardId + that
// benefit's own columns (the exact keys the app reads). The importer merges
// every benefit sheet by cardId, and routes slab_no / partner_no rows to the
// milestone / partner tables.
const benefitSheets = {
    'Lounge': ['cardId',
        'lounge_program', 'lounge_dom_visits', 'lounge_dom_period', 'lounge_dom_frequency', 'lounge_dom_criteria',
        'lounge_int_visits', 'lounge_int_period', 'lounge_int_frequency', 'lounge_int_criteria'],
    'Golf': ['cardId', 'golf_courses', 'golf_rounds', 'golf_period', 'golf_notes'],
    'Dining': ['cardId', 'dining_partner', 'dining_discount_type', 'dining_max_discount', 'dining_frequency', 'dining_min_spend', 'dining_notes'],
    'Movie': ['cardId', 'movie_partner', 'movie_discount_type', 'movie_max_discount', 'movie_frequency', 'movie_ticket_limit', 'movie_days', 'movie_notes'],
    'Spa': ['cardId', 'spa_partner', 'spa_discount', 'spa_max_discount', 'spa_frequency', 'spa_notes'],
    'Concierge': ['cardId', 'concierge_notes'],
    'Insurance': ['cardId', 'ins_provider', 'ins_coverage', 'ins_policyLink'],
    'Fee Waiver': ['cardId', 'fee_waiver_spend', 'fee_waiver_period'],
    'Fuel': ['cardId', 'fuel_rate', 'fuel_max_waiver', 'fuel_period', 'fuel_min_tx', 'fuel_max_tx'],
    'Welcome': ['cardId', 'welcome_value', 'welcome_benefit_type', 'welcome_free_text'],
    'Milestone': ['cardId', 'slab_no', 'milestone_amount', 'milestone_period', 'milestone_benefit_value', 'milestone_benefit_type', 'milestone_benefit_comment'],
    'Partner Program': ['cardId', 'partner_no', 'partner_program', 'partner_ratio', 'partner_minTransfer', 'partner_transferTime'],
};

const wb = XLSX.utils.book_new();
const addSheet = (name, cols) => {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([cols, cols.map(() => '')]), name);
    console.log(name.padEnd(20), cols.length, 'cols');
};

addSheet('Card Details', cardCols);
addSheet('Offers', OFFER_IMPORT_COLUMNS);
Object.entries(benefitSheets).forEach(([name, cols]) => addSheet(name, cols));
addSheet('MCC', MCC_IMPORT_COLUMNS);

XLSX.writeFile(wb, OUT);
console.log('\nWritten:', OUT);
