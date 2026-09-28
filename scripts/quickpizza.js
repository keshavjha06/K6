import http from 'k6/http';

import { sleep } from 'k6';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://quickpizza.grafana.com';

export let options = {
  stages: [
    { duration: '5s', target: 1 },
    { duration: '30s', target: 3 },
    { duration: '5s', target: 1 },
  ],
  thresholds: {
    // 99% of requests must finish within 1000ms.
    http_req_duration: ['p(99) < 1000'],
  },
};


export default function () {
  // Home page
  let homepage = http.get(BASE_URL);

  check(homepage, {
    'status is 200': (r) => r.status === 200,
  });

  // Login
  let login = http.post(BASE_URL + '/api/users/token/login',
    JSON.stringify({ username: 'default', password: '12345678' }),
    { headers: { 'Content-Type': 'application/json' } });

  check(login, {
    'login status is 200': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + login.json('token'),
    },
  };

  // Pick a random tool to exclude from the pizza
  let tools = http.get(BASE_URL + '/api/tools', params);

  check(tools, {
    'tools status is 200': (r) => r.status === 200,
  });

  const allTools = tools.json('tools') || [];
  const randomTool = allTools[Math.floor(Math.random() * allTools.length)];
  console.log("Excluded tool is: " + randomTool);

  // Get a pizza recommendation
  let pizza = http.post(BASE_URL + '/api/pizza', JSON.stringify({
    maxCaloriesPerSlice: 1000,
    mustBeVegetarian: false,
    excludedIngredients: [],
    excludedTools: [randomTool],
    maxNumberOfToppings: 5,
    minNumberOfToppings: 2,
  }), params);

  check(pizza, {
    'pizza status is 200': (r) => r.status === 200,
    'pizza does not use excluded tool': (r) => r.json('pizza.tool') !== randomTool,
  });

  const pizzaId = pizza.json('pizza.id');
  console.log("Recommended pizza: " + pizza.json('pizza.name') + " (id " + pizzaId + ")");

  // Rate the pizza
  let rating = http.post(BASE_URL + '/api/ratings',
    JSON.stringify({ pizza_id: pizzaId, stars: 5 }), params);

  console.log(rating.status);

  check(rating, {
    'rating status is 201': (r) => r.status === 201,
    'Rating Saved Check': (r) => r.json('pizza_id') === pizzaId,
  });


  sleep(1);
}
