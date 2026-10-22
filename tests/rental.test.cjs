/* eslint-disable @typescript-eslint/no-require-imports -- Node 20 CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Exercise the actual utilities without adding a test framework or build output.
function load(name) {
  const source = fs.readFileSync(path.join(__dirname, '../src/lib', `${name}.ts`), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    (name) => name.startsWith('./') ? load(name.slice(2)) : require(name), mod, mod.exports);
  return mod.exports;
}
const { priceCar, rentalDays } = load('pricing');
const { todayInPKT, isCalendarDate, validateBookingDates } = load('bookingDates');
const { describeQuote } = load('quote');
const { isValidPhone, normalizePhone } = load('phone');

test('daily pricing handles whole days and invalid durations', () => {
  assert.equal(priceCar({ pricePerDay: 12000 }, 3).total, 36000);
  assert.equal(priceCar({ pricePerDay: 12000 }, 2.8).total, 24000);
  for (const days of [-1, NaN, Infinity]) assert.equal(priceCar({ pricePerDay: 12000 }, days).total, 0);
  assert.equal(rentalDays('2028-02-28', '2028-03-01'), 2);
  assert.equal(rentalDays('2026-10-21', '2026-10-21'), 0);
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
