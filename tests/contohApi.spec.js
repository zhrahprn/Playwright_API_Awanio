import { test, expect, request } from '@playwright/test';

//testing API
test('contoh rest api get', async ({ page }) => {
  const apiContext = await request.newContext();
  const res = await apiContext.get('https://reqres.in/api/users/2');
  expect(res.status()).toBe(200);
  const responJson = await res.json();
  expect(responJson.data.last_name).toBe('Weaver');
  expect(responJson._meta.variant).toBe('v1_a');
  expect(responJson.support.text).toBe('Become a better CTO. A playbook of painful stories and practical advice from a two-time startup CTO.');
});

test('contoh rest api post', async ({ page }) => {
  const apiContext = await request.newContext();
  const dataBody = {
    "name": "morpheus",
    "job": "leader"
  }
  const res = await apiContext.post('https://reqres.in/api/users', {
    data : dataBody
  });

  expect(res.status()).toBe(201);
  const responJson = await res.json();
  expect(responJson.name).toBe('morpheus');
  expect(responJson.job).toBe('leader');
 
});

test('contoh rest api put', async ({ page }) => {
  const apiContext = await request.newContext();
  const dataBody = {
     "name": "morpheus",
     "job": "zion resident"
  }
  const res = await apiContext.put('https://reqres.in/api/users/2', {
    data : dataBody
  });

  expect(res.status()).toBe(200);
  const responJson = await res.json();
  expect(responJson.name).toBe('morpheus');
  expect(responJson._meta.powered_by).toBe('ReqRes');
 
});

test('contoh rest api patch', async ({ page }) => {
  const apiContext = await request.newContext();
  const dataBody = {
      "job": "zion resident"
  }
  const res = await apiContext.patch('https://reqres.in/api/users/2', {
    data : dataBody
  });

  expect(res.status()).toBe(200);
  const responJson = await res.json();
  expect(responJson._meta.powered_by).toBe('ReqRes');
 
 
});


test('contoh rest api delete', async ({ page }) => {
  const apiContext = await request.newContext();
  const dataBody = {
      "job": "zion resident"
  }
  const res = await apiContext.delete('https://reqres.in/api/users/2', {
    data : dataBody
  });

  expect(res.status()).toBe(204);
 
});
