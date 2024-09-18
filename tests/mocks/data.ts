import { fakerPT_PT as faker } from '@faker-js/faker';

export const products = [
  { id: 1, name: faker.commerce.productName(), price: faker.commerce.price({min: 20, max: 800 }) },
  { id: 2, name: faker.commerce.productName(), price: faker.commerce.price({min: 20, max: 800 }) },
  { id: 3, name: faker.commerce.productName(), price: faker.commerce.price({min: 20, max: 800 }) },
];
