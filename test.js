const { calculateTotal } = require('./pricing');

let failures = 0;

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    console.error(`FAIL: ${label} — expected ${expected}, got ${actual}`);
    failures++;
  } else {
    console.log(`PASS: ${label}`);
  }
}

const items = [
  { price: 10, qty: 2 },
  { price: 5, qty: 4 },
];
// subtotal = 20 + 20 = 40

assertEqual(calculateTotal(items, null), 40, 'no discount');
assertEqual(calculateTotal(items, 'SAVE10'), 36, '10% off with SAVE10');

process.exitCode = failures > 0 ? 1 : 0;
