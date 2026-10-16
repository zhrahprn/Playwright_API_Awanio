import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { createEmployeeApi } from '../../components/authApi';
import { newEmployeeData } from '../../data/authData';

test('Negatif test - Create karyawan pakai token employee', async () => {
  // 1. Ambil token employee dari 
  const tokenData = readTokenFile();
  const employeeToken = tokenData.newEmployeeToken || tokenData.employeeToken;
  expect(employeeToken).toBeDefined();

  // 2. Siapkan payload dummy
  const uniqueId = Date.now().toString().slice(-4);
  const payload = {
    ...newEmployeeData,
    email: `gagal.${uniqueId}@example.com`,
    employee_number: `8${uniqueId}`,
  };

  // Panggil API Create Employee menggunakan token Karyawan 
  const createRes = await createEmployeeApi(employeeToken, payload);
  
  const status = createRes.status();
  console.log(`Status respons saat karyawan mencoba tambah karyawan: ${status}`);
  
  expect([401, 403]).toContain(status);

  const errorBody = await createRes.json();
  console.log('Pesan error dari server:', errorBody);
});