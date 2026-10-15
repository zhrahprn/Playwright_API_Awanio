import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { getProfileApi } from '../../components/authApi';
import { expectedAdminProfile } from '../../data/authData';

test('GET profil admin', async () => {
  const tokenData = readTokenFile();
  // Ambil menggunakan adminToken sesuai yang disimpan saat login admin
  const token = tokenData.adminToken || tokenData.token; 
  expect(token).toBeDefined();

  const res = await getProfileApi(token);
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.success).toBe(true);
  expect(body.data.email).toBe(expectedAdminProfile.email);
  expect(body.data.role).toBe(expectedAdminProfile.role);
  expect(body.data.employee.full_name).toBe(expectedAdminProfile.fullName);
});