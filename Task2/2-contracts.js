'use strict';

const { PurchaseIterator } = require('./PurchaseIterator');
const { Basket } = require('./Basket');

// Create Iterator for given dataset with Symbol.asyncIterator
// Use for..of to iterate it and pass data to Basket
// Basket is limited to certain amount
// After iteration ended Basket should return Thenable
// to notify us with final list of items, total and
// escalated errors

const purchase = [
  { name: 'Laptop',  price: 1500 },
  { name: 'Mouse',  price: 25 },
  { name: 'Keyboard',  price: 100 },
  { name: 'HDMI cable',  price: 10 },
  { name: 'Bag', price: 50 },
  { name: 'Mouse pad', price: 5 },
  { name: 'Mouse pad1', price: 5 },
  { name: 'Mouse pad2', price: 5 },
  { name: 'Mouse pad3', price: 5 },
  { name: 'Mouse pad4', price: 5 },
  { name: 'Mouse pad4', price: 5 },
  { name: 'Mouse pad4', price: 5 },
  { name: 'Mouse pad4', price: 5 },
];

const main = async () => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 100 }, ({items, total, errors, exitError}) => {
    console.log("total: ", total);
    console.log("items: ", items);
    console.log("errors: ", errors);
    console.log("exitError: ", exitError);
  });
  const readGoods = async () => {
    for await (const item of goods) {
      if (!basket.add(item)) return;
    }
    basket.end();
  };
  await readGoods();
};

main();
