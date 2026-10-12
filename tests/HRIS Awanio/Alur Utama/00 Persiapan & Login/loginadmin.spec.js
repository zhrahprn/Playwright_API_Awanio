import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const TOKEN_FILE = path.resolve(__dirname, '../../playwright/.auth/admin-token.json');

function readTokenFile() {
  if (!fs.existsSync(TOKEN_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
}

function writeTokenFile(data) {
  fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
  const existing = fs.existsSync(TOKEN_FILE) ? readTokenFile() : {};
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ ...existing, ...data }, null, 2));
}

test('POST login admin', async () => {
  const apiContext = await request.newContext();

  const res = await apiContext.post('https://api.hris.click/api/v1/auth/login', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      email: 'zahrah.purnama@gmail.com',
      password: '123456789',
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  writeTokenFile({ token: body.token || body.data?.token });
});