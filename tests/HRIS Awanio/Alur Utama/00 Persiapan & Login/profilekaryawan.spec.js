import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const EMPLOYEE_TOKEN_FILE = path.resolve(__dirname, '../../playwright/.auth/employee-token.json');

function readEmployeeTokenFile() {
  return JSON.parse(fs.readFileSync(EMPLOYEE_TOKEN_FILE, 'utf-8'));
}

test('GET profil karyawan', async () => {
  const { token } = readEmployeeTokenFile();
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
  expect(body.data.email).toBe('testingqa@gmail.com');
  expect(body.data.role).toBe('employee');
  expect(body.data.employee.full_name).toBe('testingQA');
});