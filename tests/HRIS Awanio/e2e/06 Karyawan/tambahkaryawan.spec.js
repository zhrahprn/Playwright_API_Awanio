import { test, expect } from '@playwright/test';
import { readTokenFile, writeTokens } from '../../components/authHelper';
import { createEmployeeApi, loginEmployeeApi, getDepartmentsApi } from '../../components/authApi';
import { newEmployeeData } from '../../data/authData';

test('POST Create Karyawan dengan Department Dinamis', async () => {
  const tokenData = readTokenFile();
  const adminToken = tokenData.adminToken || tokenData.token;
  expect(adminToken).toBeDefined();

  // 1. Ambil list department secara dinamis dari server
  const deptRes = await getDepartmentsApi(adminToken);
  expect(deptRes.status()).toBe(200);
  const deptBody = await deptRes.json();
  
  const departments = deptBody.data || deptBody;
  expect(departments.length).toBeGreaterThan(0);
  const dynamicDepartmentId = departments[0].id; // Mengambil ID departemen pertama yang aktif

  // 2. Buat data unik (timestamp) untuk menghindari duplikasi
  const timestamp = Date.now();
  const uniqueEmail = `qa.karyawan.${timestamp}@example.com`; 
  const uniquePhone = `+62899${timestamp.toString().slice(-7)}`;
  const uniqueEmpNumber = timestamp.toString().slice(-5);

  const payload = {
    ...newEmployeeData,
    email: uniqueEmail,
    phone: uniquePhone,
    employee_number: uniqueEmpNumber,
    department_id: dynamicDepartmentId, // Menyuntikkan department_id secara dinamis
  };

  const createRes = await createEmployeeApi(adminToken, payload);
  expect(createRes.status()).toBe(201);

  const createBody = await createRes.json();
  expect(createBody.success).toBe(true);
  
  // Ambil ID karyawan baru dari respons create
  const createdEmployeeId = createBody.data.employee.id;
  expect(createdEmployeeId).toBeDefined();

  // Login untuk ambil token karyawan baru
  const loginRes = await loginEmployeeApi({
    email: uniqueEmail, 
    password: newEmployeeData.password,
  });
  
  expect(loginRes.status()).toBe(200);
  const loginBody = await loginRes.json();
  const employeeToken = loginBody.token || loginBody.data?.token;

  // Simpan token dan employee id 
  writeTokens({ 
    newEmployeeToken: employeeToken,
    employeeId: createdEmployeeId 
  });

  console.log('Karyawan baru & ID berhasil disimpan:', createdEmployeeId);
});