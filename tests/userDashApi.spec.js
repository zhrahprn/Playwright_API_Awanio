import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const USERNAME_TEST = 'testingqasatu';
const TOKEN_FILE = path.resolve(__dirname, '../../playwright/.auth/api-token.json');

function readTokenFile() {
  return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
}

function writeTokenFile(data) {
  fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
  const existing = fs.existsSync(TOKEN_FILE) ? readTokenFile() : {};
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ ...existing, ...data }));
}

test('1. login sa api - berhasil', async () => {
  const apiContext = await request.newContext();

  const res = await apiContext.post('https://api-dev-v2.awan.io/v2/accounts/sa/login', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      username: 'zahrahh1',
      password: 'Zahrah1,',
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.username).toBe('zahrahh1');

  writeTokenFile({ token: body.data.token });
});

test('2. create user - berhasil', async () => {
  const { token } = readTokenFile();
  const apiContext = await request.newContext();

  const res = await apiContext.post('https://api-dev-v2.awan.io/v2/sa/users', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    data: {
      name: USERNAME_TEST,
      username: USERNAME_TEST,
      email: `${USERNAME_TEST}@gmail.com`,
      password: 'Testing1@',
      password_confirmation: 'Testing1@',
    },
  });

  if (res.status() !== 200) {
    const errorBody = await res.json();
    console.log('DETAIL ERROR BACKEND:', JSON.stringify(errorBody, null, 2));
  }

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.username).toBe(USERNAME_TEST);

  writeTokenFile({ userUuid: body.data.uuid });
});

test('3. update user - berhasil', async () => {
  const { token, userUuid } = readTokenFile();
  const updatedName = `${USERNAME_TEST}1-updated`;
  const apiContext = await request.newContext();

  const res = await apiContext.put(`https://api-dev-v2.awan.io/v2/sa/users/${userUuid}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'text/plain;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    data: JSON.stringify({
      name: updatedName,
      username: USERNAME_TEST,
      email: `${USERNAME_TEST}@gmail.com`,
      organization_quota: 5,
      status: 'inactive',
    }),
  });

  if (res.status() !== 200) {
    const errorBody = await res.json();
    console.log('DETAIL ERROR UPDATE:', JSON.stringify(errorBody, null, 2));
  }

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.name).toBe(updatedName);
  expect(body.data.uuid).toBe(userUuid);
});

test('4. delete user - berhasil', async () => {
  const { token, userUuid } = readTokenFile();
  const apiContext = await request.newContext();

  const res = await apiContext.delete(`https://api-dev-v2.awan.io/v2/sa/users/${userUuid}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
});