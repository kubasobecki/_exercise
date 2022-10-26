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

//////////////////////////////////////////////////////////////////////////////
// TOP LEVEL AWAIT (ES2022 only in modules)
// ☝ blocks execution of entire module ☝
//////////////////////////////////////////////////////////////////////////////

// const posts = await fetch(`https://jsonplaceholder.typicode.com/posts`);
// const postsJSON = await posts.json();
// const postTitles = postsJSON.map(post => post.title);
// console.log(postsJSON);
// console.log(postTitles);
// console.log(
//   `❗This should go before fetch if top-level await wasn't blocking❗`
// );

async function getLastPost() {
  try {
    const posts = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    const postsJSON = await posts.json();
    console.log(postsJSON.at(-1));
    return { title: postsJSON.at(-1).title, text: postsJSON.at(-1).body };
  } catch (err) {
    console.error(err.message);
  }
}

// Not very clean
// const lastPost = getLastPost();
// lastPost.then(lp => console.log(lp));

const lastPost2 = await getLastPost();
console.log(lastPost2);
