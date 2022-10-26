// Importing module
// import './shoppingCart.js';
// console.log('Importing module');

// import { addToCart, totalPrice as tp, tq } from './shoppingCart.js';
// addToCart('peach', 10);
// console.log(tp, tq);

// import * as ShoppingCart from './shoppingCart.js';
// console.log(ShoppingCart);
// console.log(ShoppingCart.totalPrice, ShoppingCart.tq);

// Import default export
// import add2cart from './shoppingCart.js';
// add2cart('apple', 12);

// Import default and named export
import add2cart, { totalPrice as tp, tq, cart } from './shoppingCart.js';
add2cart('banana', 42);
add2cart('dumplings', 23);
add2cart('zerglings', 2);
console.log(cart);
