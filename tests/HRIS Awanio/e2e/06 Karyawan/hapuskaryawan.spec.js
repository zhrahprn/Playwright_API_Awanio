import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { deleteEmployeeApi } from '../../components/authApi';

test('DELETE hapus karyawan', async () => {
  // Ambil token admin dan employeeId
  const tokenData = readTokenFile();
  const adminToken = tokenData.adminToken || tokenData.token;
  expect(adminToken).toBeDefined();

  const employeeId = tokenData.employeeId;
  expect(employeeId).toBeDefined();

  // 2. Panggil API Delete Employee 
  const res = await deleteEmployeeApi(adminToken, employeeId);
  
  // 3. Validasi respons
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.success).toBe(true);
  expect(body.message).toBe("Employee deleted successfully");

  console.log('Karyawan berhasil dihapus untuk ID:', employeeId);
});