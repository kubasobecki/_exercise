// Exporting module
// console.log('Exporting module');

// Blocking code (top-level await)
console.log('Started fetching users');
const users = await fetch(`https://jsonplaceholder.typicode.com/users`);
const usersJSON = await users.json();
console.log(usersJSON.map(user => user.username));
console.log('Finished fetching users');

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
