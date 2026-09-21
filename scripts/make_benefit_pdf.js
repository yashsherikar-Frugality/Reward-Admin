/*
 * Preferred Benefits reference PDF — every checkbox in the wizard, grouped the
 * same way the UI groups them, with the input fields (and dropdown options)
 * that open when you tick it. Pulled straight from the app source.
 *
 *   npm i --no-save pdfkit
 *   node scripts/make_benefit_pdf.js [out.pdf]
 */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'Preferred_Benefits_Reference.pdf');

const script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
const arrLit = (n) => script.match(new RegExp('const ' + n + '\\s*=\\s*(\\[[\\s\\S]*?\\n\\];)'))[1].replace(/;$/, '');
const objLit = (n) => script.match(new RegExp('const ' + n + '\\s*=\\s*(\\{[\\s\\S]*?\\n\\};)'))[1].replace(/;$/, '');

const win = {}; (function (window) { eval(fs.readFileSync(path.join(ROOT, 'js', 'benefit_spec.js'), 'utf8')); })(win);
const VOCAB = win.BENEFIT_VOCAB || {};
const SPEC = win.BENEFIT_DETAIL_SPEC || {};
const MINI = eval('(' + objLit('WIZARD_BENEFIT_MINI_SPEC') + ')');
const SPEC_MAP = eval('(' + objLit('WIZARD_BENEFIT_SPEC_MAP') + ')');
const GROUPS = eval('(' + arrLit('WIZARD_BENEFIT_GROUPS') + ')');

const BOOLISH = new Set(['room_upgrade', 'complimentary_night', 'breakfast_included', 'early_checkin', 'late_checkout', 'status_match',
    'boarding_pass_required', 'reservation_required', 'dine_in_only', 'tip_excluded', 'tax_excluded', 'lesson_available', 'caddie_included',
    'guest_allowed', 'automatic_waiver', 'partial_waiver_allowed', 'gst_reversal', 'dcc_supported', 'international_reward_eligible',
    'upi_enabled', 'merchant_transaction_eligible', 'p2p_eligible', 'international_support', 'booking_required', 'breakfast']);
const label = (id) => id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const norm = (f) => {
    if (Array.isArray(f)) {
        const [id, kind, vk] = f;
        if (kind === 'bool') return { id, kind: 'bool' };
        return { id, kind: kind === 'multi' ? 'multi-select' : 'select', opts: Array.isArray(vk) ? vk : (VOCAB[vk] || []) };
    }
    if (BOOLISH.has(f)) return { id: f, kind: 'bool' };
    return { id: f, kind: 'text' };
};
const SHEET_EXTRAS = {
    benefit_lounge: [['lounge_usage_type', 'select', ['Card Swipe', 'Voucher', 'PP', 'Other', 'TBC']]],
    benefit_dining: [['dining_platform', 'select', ['Zomato', 'Swiggy', 'Merchant', 'Other']], 'dining_discount_value', 'dining_restaurant_mapping'],
    benefit_fuel: [['fuel_waiver_period', 'select', ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']], 'fuel_max_tx_count', ['fuel_count_period', 'select', ['Per Day', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']]],
    benefit_forex: ['forex_ccy_markup', 'conversion_charge'],
    benefit_ltf: ['notes'],
};

function fieldsFor(id) {
    const def = (SPEC_MAP[id] && SPEC[SPEC_MAP[id]]) || MINI[id] || { fields: ['notes'] };
    const raw = [...(SHEET_EXTRAS[id] || []), ...(def.fields || [])];
    const seen = new Set();
    return raw.map(norm).filter(f => !seen.has(f.id) && seen.add(f.id));
}

// ---------- render ----------
const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
doc.pipe(fs.createWriteStream(OUT));

const PAGE_W = doc.page.width - 100;
doc.fontSize(20).font('Helvetica-Bold').text('RewardGenius — Preferred Benefits Reference', { align: 'left' });
doc.moveDown(0.3);
doc.fontSize(10).font('Helvetica').fillColor('#555')
    .text('Every checkbox in the "Add Reward Rule" benefit checklist, grouped as in the app, with the input fields that open when you tick it.');
doc.fillColor('#000');
doc.moveDown(1);

GROUPS.forEach((g) => {
    doc.moveDown(0.5);
    if (doc.y > doc.page.height - 120) doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#4338ca').text(g.title.toUpperCase());
    doc.fillColor('#000');
    doc.moveDown(0.3);

    g.items.forEach(([id, name]) => {
        const fields = fieldsFor(id);
        const rowsHeight = fields.reduce((h, f) => h + (f.opts && f.opts.length ? 28 : 16), 30);
        if (doc.y > doc.page.height - 70 - Math.min(rowsHeight, 200)) doc.addPage();

        doc.fontSize(11.5).font('Helvetica-Bold').text('☐ ' + name);
        doc.moveDown(0.15);

        if (!fields.length) {
            doc.fontSize(9.5).font('Helvetica-Oblique').fillColor('#666').text('No additional input — checkbox only.');
            doc.fillColor('#000');
        } else {
            fields.forEach((f) => {
                const fy = doc.y;
                doc.fontSize(9.5).font('Helvetica-Bold').text('  • ' + label(f.id) + '  ', { continued: true });
                if (f.kind === 'bool') {
                    doc.font('Helvetica').fillColor('#555').text('[Yes / No]');
                } else if (f.kind === 'text') {
                    doc.font('Helvetica').fillColor('#555').text('[free text]');
                } else {
                    const capped = f.opts.length > 12 ? f.opts.slice(0, 12).concat(`… +${f.opts.length - 12} more`) : f.opts;
                    doc.font('Helvetica').fillColor('#555').text(`[${f.kind}] ` + capped.join(', '), { width: PAGE_W - 40 });
                }
                doc.fillColor('#000');
            });
        }
        doc.moveDown(0.5);
    });
});

// page numbers
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor('#999').text(`Page ${i + 1} of ${range.count}`, 0, doc.page.height - 40, { align: 'center', width: doc.page.width });
}

doc.end();
console.log('groups:', GROUPS.length, ' benefits:', GROUPS.reduce((n, g) => n + g.items.length, 0));
console.log('Written:', OUT);
