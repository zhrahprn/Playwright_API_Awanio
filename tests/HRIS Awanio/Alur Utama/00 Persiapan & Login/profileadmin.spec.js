import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const TOKEN_FILE = path.resolve(__dirname, '../../playwright/.auth/admin-token.json');

function readTokenFile() {
  return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
}

test('GET Profile admin', async () => {
  const { token } = readTokenFile();
  const apiContext = await request.newContext();

  const res = await apiContext.get('https://api.hris.click/api/v1/auth/me', {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });

  expect(res.status()).toBe(200);

  const body = await res.json();
  
  expect(body.success).toBe(true);
  expect(body.data.role).toBe('admin');
  expect(body.data.email).toBe('zahrah.purnama@gmail.com');
});