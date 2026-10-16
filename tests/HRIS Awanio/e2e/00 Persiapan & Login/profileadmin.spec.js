import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { getProfileApi } from '../../components/authApi';
import { expectedAdminProfile } from '../../data/authData';

test('GET profil admin', async () => {
  //membaca data token 
  const tokenData = readTokenFile();
 
  const token = tokenData.adminToken || tokenData.token; //mengambil token khusus admin 
  expect(token).toBeDefined();

  const res = await getProfileApi(token); //mengirim permintaan get profile ke server dengan token admin
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.success).toBe(true);
  expect(body.data.email).toBe(expectedAdminProfile.email);
  expect(body.data.role).toBe(expectedAdminProfile.role); //validasi bahwa role akun tersebut adalah admin
  expect(body.data.employee.full_name).toBe(expectedAdminProfile.fullName);
});