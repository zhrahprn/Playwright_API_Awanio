import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const EMPLOYEE_TOKEN_FILE = path.resolve(__dirname, '../../playwright/.auth/employee-token.json');

function readEmployeeTokenFile() {
  return JSON.parse(fs.readFileSync(EMPLOYEE_TOKEN_FILE, 'utf-8'));
}

test('GET Fitur karyawan', async () => {
  const { token } = readEmployeeTokenFile();
  const apiContext = await request.newContext();

  const res = await apiContext.get('https://api.hris.click/api/v1/me/features', {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  expect(res.status()).toBe(200);

  const body = await res.json();
  
  expect(body.success).toBe(true);
  expect(body.data.role).toBe('employee');
  expect(body.data.is_admin).toBe(false);
  expect(Array.isArray(body.data.codes)).toBe(true);
});