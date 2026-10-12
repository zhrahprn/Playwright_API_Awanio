import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const EMPLOYEE_TOKEN_FILE = path.resolve(__dirname, '../../playwright/.auth/employee-token.json');

function readEmployeeTokenFile() {
  if (!fs.existsSync(EMPLOYEE_TOKEN_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(EMPLOYEE_TOKEN_FILE, 'utf-8'));
}

function writeEmployeeTokenFile(data) {
  fs.mkdirSync(path.dirname(EMPLOYEE_TOKEN_FILE), { recursive: true });
  const existing = fs.existsSync(EMPLOYEE_TOKEN_FILE) ? readEmployeeTokenFile() : {};
  fs.writeFileSync(EMPLOYEE_TOKEN_FILE, JSON.stringify({ ...existing, ...data }, null, 2));
}

test('POST login karyawan', async () => {
  const apiContext = await request.newContext();

  const res = await apiContext.post('https://api.hris.click/api/v1/auth/login', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      email: 'testingQA@gmail.com', 
      password: 'Testing2@',
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  writeEmployeeTokenFile({ token: body.token || body.data?.token });
});