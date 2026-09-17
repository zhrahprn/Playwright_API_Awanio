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

test('2. search user by name - berhasil', async () => {
  const { token } = readTokenFile();
  const apiContext = await request.newContext();
  const searchQuery = 'Zahrah Purnama Alam';

  const res = await apiContext.get(`https://api-dev-v2.awan.io/v2/sa/users`, {
    params: {
      kind: 'account',
      page: 1,
      per_page: 15,
      search: searchQuery,
    },
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);
  expect(body.data[0].name).toBe(searchQuery);
  
  // Simpan UUID user aktif untuk test view detail nanti
  writeTokenFile({ activeUserUuid: body.data[0].uuid });
});

test('3. filter users by status (active & inactive) - berhasil', async () => {
  const { token } = readTokenFile();
  const apiContext = await request.newContext();

  // Test filter status: active
  const resActive = await apiContext.get(`https://api-dev-v2.awan.io/v2/sa/users`, {
    params: {
      kind: 'account',
      page: 1,
      per_page: 15,
      status: 'active',
    },
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  expect(resActive.status()).toBe(200);
  const bodyActive = await resActive.json();
  expect(bodyActive.result).toBe(true);
  bodyActive.data.forEach(user => {
    expect(user.status).toBe('active');
  });

  // Test filter status: inactive
  const resInactive = await apiContext.get(`https://api-dev-v2.awan.io/v2/sa/users`, {
    params: {
      kind: 'account',
      page: 1,
      per_page: 15,
      status: 'inactive',
    },
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  expect(resInactive.status()).toBe(200);
  const bodyInactive = await resInactive.json();
  expect(bodyInactive.result).toBe(true);
  bodyInactive.data.forEach(user => {
    expect(user.status).toBe('inactive');
  });
});

test('4. view detail active user - berhasil', async () => {
  const { token, activeUserUuid } = readTokenFile();
  const apiContext = await request.newContext();

  const res = await apiContext.get(`https://api-dev-v2.awan.io/v2/sa/users/${activeUserUuid}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.uuid).toBe(activeUserUuid);
  expect(body.data.status).toBe('active');
});