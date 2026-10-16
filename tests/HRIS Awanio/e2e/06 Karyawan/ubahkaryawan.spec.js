import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { updateEmployeeApi } from '../../components/authApi';
import { updateEmployeeData } from '../../data/authData'; // <-- Pastikan baris ini ada di atas

test('PATCH update data karyawan', async () => {
  // 1. Ambil token admin dan employeeId 
  const tokenData = readTokenFile();
  const adminToken = tokenData.adminToken || tokenData.token;
  expect(adminToken).toBeDefined();

  const employeeId = tokenData.employeeId;
  expect(employeeId).toBeDefined();

  // 2. Panggil API Update Employee 
  const res = await updateEmployeeApi(adminToken, employeeId, updateEmployeeData);
  
  // 3. Validasi respons sukses
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.success).toBe(true);

  // 4. Validasi perubahan data
  const updatedData = body.data || body; 
  expect(updatedData.address).toBe(updateEmployeeData.address);
  expect(updatedData.employment_status).toBe(updateEmployeeData.employment_status);

  console.log('Data karyawan berhasil diubah untuk ID:', updatedData.id);
});