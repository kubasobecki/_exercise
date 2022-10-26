// Exporting module
// console.log('Exporting module');

const shippingCost = 10;
export const cart = [];

export function addToCart(prod, qty) {
  cart.push({ prod, qty });
  console.log(`${qty} ${prod} added to cart`);
}

const totalPrice = 237;
const totalQty = 23;

export { totalPrice, totalQty as tq };

// Default export - no name or variable is involved, just the value
export default function (prod, qty) {
  cart.push({ prod, qty });
  console.log(`${qty} ${prod} added to cart`);
}
