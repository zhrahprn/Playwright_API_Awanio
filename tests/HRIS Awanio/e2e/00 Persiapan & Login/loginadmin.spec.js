import { test, expect } from '@playwright/test';
import { adminLoginData } from '../../data/authData';
import { loginAdminApi } from '../../components/authApi';
import { writeTokens, readTokenFile } from '../../components/authHelper'; // Gunakan readTokenFile

test('POST login admin', async () => {
  const res = await loginAdminApi(adminLoginData);
  expect(res.status()).toBe(200);
  
  const body = await res.json();
  expect(body.success).toBe(true);

  const extractedToken = body.token || body.data?.token;
  writeTokens({ adminToken: extractedToken });

  const tokens = readTokenFile(); // Sesuaikan dengan nama fungsi yang diimport
  expect(tokens.adminToken).toBeDefined();
  console.log('Admin Token berhasil disimpan:', tokens.adminToken);
});