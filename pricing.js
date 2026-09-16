function calculateTotal(items, discountCode) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  let discount = 0;

  if (discountCode === 'SAVE10') {
    discount = subtotal * 0.10;
  } else if (discountCode === 'HOLIDAY25') {
    discount = subtotal * 0.25;
  } else if (discountCode === 'BULK20' && (items.length >= 5 || totalQty >= 5)) {
    discount = subtotal * 0.20;
  }

  return subtotal - discount;
}

module.exports = { calculateTotal };