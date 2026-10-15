import { test, expect } from '@playwright/test';
import { employeeLoginData } from '../../data/authData';
import { loginEmployeeApi } from '../../components/authApi';
import { writeTokens, readTokenFile } from '../../components/authHelper';

test('POST login karyawan', async () => {
  const res = await loginEmployeeApi(employeeLoginData);
  expect(res.status()).toBe(200);
  
  const body = await res.json();
  expect(body.success).toBe(true);

  // Ambil token dari body.data.token sesuai struktur JSON baru
  const extractedToken = body.data?.token || body.token;
  expect(extractedToken).toBeDefined();

  // Simpan dengan key khusus employeeToken
  writeTokens({ employeeToken: extractedToken });

  const tokens = readTokenFile();
  expect(tokens.employeeToken).toBeDefined();
  console.log('Employee Token berhasil disimpan:', tokens.employeeToken);
});