/* eslint-disable @typescript-eslint/no-require-imports -- Node 20 CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Exercise the actual utilities without adding a test framework or build output.
function load(name) {
  const source = fs.readFileSync(path.join(__dirname, '../src/lib', `${name}.ts`), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    (name) => name.startsWith('./') ? load(name.slice(2)) : require(name), mod, mod.exports);
  return mod.exports;
}
const { priceCar, rentalDays } = load('pricing');
const { todayInPKT, isCalendarDate, validateBookingDates } = load('bookingDates');
const { describeQuote } = load('quote');
const { isValidPhone, normalizePhone } = load('phone');
const { validateBookingContact } = load('bookingContact');
const { emptyBooking, restoreBookingDraft } = load('bookingDraft');

test('booking contact rejects whitespace names and accepts existing phone formats', () => {
  const contact = { firstName: ' Ali ', lastName: ' Khan ', email: ' ali@example.com ', phone: '+92 (304) 525-5558' };
  assert.deepEqual(validateBookingContact(contact), {});
  const errors = validateBookingContact({ ...contact, firstName: ' \t ', lastName: '\n', email: 'invalid', phone: '123' });
  assert.ok(errors.firstName);
  assert.ok(errors.lastName);
  assert.ok(errors.email);
  assert.ok(errors.phone);
});

test('daily pricing handles whole days and invalid durations', () => {
  assert.equal(priceCar({ pricePerDay: 12000 }, 3).total, 36000);
  assert.equal(priceCar({ pricePerDay: 12000 }, 2.8).total, 24000);
  for (const days of [-1, NaN, Infinity]) assert.equal(priceCar({ pricePerDay: 12000 }, days).total, 0);
  assert.equal(rentalDays('2028-02-28', '2028-03-01'), 2);
  assert.equal(rentalDays('2026-10-21', '2026-10-21'), 0);
});

test('rentalDays rejects impossible calendar dates instead of normalizing them', () => {
  for (const value of ['2027-02-29', '2026-02-30', '2026-04-31', '0000-01-01', '2026-1-01', 'invalid', '']) {
    assert.equal(rentalDays(value, '2028-03-01'), 0);
    assert.equal(rentalDays('2026-01-01', value), 0);
  }
  assert.equal(rentalDays('2028-02-29', '2028-03-01'), 1);
});

test('draft recovery restores fields and step but rejects corrupt storage', () => {
  const data = { ...emptyBooking('revo'), customCarNames: ['Custom SUV'], pickupDate: '2028-02-28', returnDate: '2028-03-01', pickupLocation: 'Airport', firstName: 'Ali', lastName: 'Khan', email: 'ali@example.com', phone: '03001234567' };
  const now = Date.parse('2028-02-01T12:00:00Z');
  const restore = (raw, initial) => restoreBookingDraft(raw, ['revo', 'audi'], ['Airport'], initial, now);
  assert.deepEqual(restore(JSON.stringify({ version: 1, formData: data, step: 4 })), { formData: data, step: 4 });
  for (const raw of [null, '{', 'null', '[]', '{"version":2}', '{"version":1,"formData":null}']) {
    assert.deepEqual(restore(raw), { formData: emptyBooking(), step: 1 });
  }
  const explicit = restore(JSON.stringify({ version: 1, formData: data, step: 4 }), 'audi');
  assert.deepEqual(explicit.formData.carIds, ['revo', 'audi']);
  assert.equal(explicit.step, 2);
});

test('draft recovery filters unavailable vehicles and revalidates progress', () => {
  const now = Date.parse('2028-02-01T12:00:00Z');
  const restore = (formData) => restoreBookingDraft(JSON.stringify({ version: 1, formData, step: 4 }), ['revo'], ['Airport'], undefined, now);
  const base = { ...emptyBooking('revo'), pickupDate: '2028-02-28', returnDate: '2028-03-01', pickupLocation: 'Airport' };
  assert.equal(restore(base).step, 3);
  assert.equal(restore({ ...base, pickupDate: '2027-01-01' }).step, 2);
  assert.equal(restore({ ...base, pickupLocation: 'Unknown' }).formData.pickupLocation, '');
  assert.equal(restore({ ...base, carIds: ['unavailable', 42] }).step, 1);
  const sanitized = restore({ ...base, carIds: ['revo', 'revo'], customCarNames: [' ', 42, ' SUV '], firstName: 42 });
  assert.deepEqual(sanitized.formData.carIds, ['revo']);
  assert.deepEqual(sanitized.formData.customCarNames, ['SUV']);
  assert.equal(sanitized.formData.firstName, '');
});
test('pickup validation changes at Pakistan midnight', () => {
  const before = Date.parse('2026-10-21T18:59:59Z');
  const after = before + 1000;
  assert.equal(todayInPKT(before), '2026-10-21');
  assert.equal(todayInPKT(after), '2026-10-22');
  assert.deepEqual(validateBookingDates('2026-10-21', '2026-10-22', before), {});
  assert.ok(validateBookingDates('2026-10-21', '2026-10-22', after).pickupDate);
});
test('calendar validation rejects impossible dates and nonpositive periods', () => {
  assert.equal(isCalendarDate('2027-02-29'), false);
  assert.equal(isCalendarDate('2028-02-29'), true);
  assert.equal(isCalendarDate('0000-01-01'), false);
  const now = Date.parse('2026-10-20T12:00:00Z');
  for (const end of ['2026-10-20', '2026-10-21', 'invalid']) {
    assert.ok(validateBookingDates('2026-10-21', end, now).returnDate);
  }
});
test('custom quotes remain separate from the known subtotal', () => {
  const mixed = describeQuote({ knownSubtotal: 36000, pendingCustomQuotes: 1 });
  assert.equal(mixed.label, 'Known subtotal');
  assert.ok(mixed.note.includes('separately'));
  assert.equal(describeQuote({ knownSubtotal: null, pendingCustomQuotes: 1 }).value, 'Quote on request');
  assert.equal(describeQuote({ knownSubtotal: null, pendingCustomQuotes: 0 }).value, 'Select valid dates');
});
test('phone validation handles formatting, optional values and malformed input', () => {
  assert.equal(normalizePhone('+92 (304) 525-5558'), '+923045255558');
  assert.equal(isValidPhone('+92 (304) 525-5558'), true);
  for (const value of ['123', '++923045255558', '0304abc5558']) assert.equal(isValidPhone(value), false);
  assert.equal(isValidPhone('', false), true);
  assert.equal(isValidPhone(''), false);
});
