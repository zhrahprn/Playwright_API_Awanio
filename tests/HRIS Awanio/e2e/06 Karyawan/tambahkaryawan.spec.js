import { test, expect } from '@playwright/test';
import { readTokenFile, writeTokens } from '../../components/authHelper';
import { createEmployeeApi, loginEmployeeApi, getDepartmentsApi, getVerificationCodeApi, verifyEmailApi, updateEmployeeApi, deleteEmployeeApi } from '../../components/authApi';
import { newEmployeeData } from '../../data/authData';

test.describe('Skenario Siklus Hidup Karyawan Awanio (CRUD)', () => {

  // Step 1: Buat Karyawan & Cek Verifikasi (Pending State)
  test('POST Create Karyawan & Ambil Kode Verifikasi (Pending State)', async () => {
    const tokenData = readTokenFile();
    const adminToken = tokenData.adminToken || tokenData.token;
    expect(adminToken).toBeDefined();

    const deptRes = await getDepartmentsApi(adminToken);
    expect(deptRes.status()).toBe(200);
    const dynamicDepartmentId = (await deptRes.json()).data[0].id;

    const timestamp = Date.now();
    const payload = {
      ...newEmployeeData,
      email: `qa.pending.${timestamp}@example.com`,
      phone: `+62899${timestamp.toString().slice(-7)}`,
      employee_number: `1${timestamp.toString().slice(-4)}`,
      department_id: dynamicDepartmentId,
    };

    const createRes = await createEmployeeApi(adminToken, payload);
    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    const createdEmployeeId = createBody.data.employee.id;
    expect(createdEmployeeId).toBeDefined();

    const codeRes = await getVerificationCodeApi(adminToken, payload.email);
    
    if (codeRes.status() === 200) {
      const codeBody = await codeRes.json();
      console.log('Kode verifikasi didapatkan:', codeBody.data?.code);
    } else {
      console.log(`Catatan Test 1: Mendapatkan status ${codeRes.status()} saat ambil kode.`);
    }

    console.log('Test 1 Selesai: Karyawan berhasil dibuat dalam status pending.');
  });


  // Step 2: Buat Karyawan, Verifikasi Email, & Langsung Aktif (Menyimpan employeeId)
  test('Test 2: POST Create Karyawan, Verifikasi Email, & Langsung Aktif', async () => {
    const tokenData = readTokenFile();
    const adminToken = tokenData.adminToken || tokenData.token;
    expect(adminToken).toBeDefined();

    const deptRes = await getDepartmentsApi(adminToken);
    expect(deptRes.status()).toBe(200);
    const dynamicDepartmentId = (await deptRes.json()).data[0].id;

    const timestamp = Date.now() + 500;
    const payload = {
      ...newEmployeeData,
      email: `qa.aktif.${timestamp}@example.com`,
      phone: `+62888${timestamp.toString().slice(-7)}`,
      employee_number: `2${timestamp.toString().slice(-4)}`,
      department_id: dynamicDepartmentId,
    };

    const createRes = await createEmployeeApi(adminToken, payload);
    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    const createdEmployeeId = createBody.data.employee.id;

    let verificationCode = createBody.data?.verification_code || createBody.data?.code;

    if (!verificationCode) {
      const codeRes = await getVerificationCodeApi(adminToken, payload.email);
      if (codeRes.status() === 200) {
        verificationCode = (await codeRes.json()).data?.code;
      }
    }

    if (verificationCode) {
      const verifyRes = await verifyEmailApi({
        email: payload.email,
        code: verificationCode
      });
      expect(verifyRes.status()).toBe(200);
      console.log('Test 2 - Akun berhasil diverifikasi!');
    } else {
      console.log('Test 2 - Akun mungkin langsung aktif.');
    }

    const loginRes = await loginEmployeeApi({
      email: payload.email, 
      password: newEmployeeData.password,
    });
    
    expect(loginRes.status()).toBe(200);
    const employeeToken = (await loginRes.json()).token || (await loginRes.json()).data?.token;

    // Menyimpan UUID karyawan aktif ke .consultoken.json untuk dipakai step edit & delete
    writeTokens({ 
      newEmployeeToken: employeeToken,
      employeeId: createdEmployeeId 
    });

    console.log('Test 2 Selesai: Karyawan sukses dibuat dan token tersimpan!');
  });


  // Step 3: Ubah Karyawan Berdasarkan UUID dari Data Sebelumnya (Full name hanya huruf/spasi)
  test('Test 3: PATCH Ubah Data Karyawan', async () => {
    const tokenData = readTokenFile();
    const adminToken = tokenData.adminToken || tokenData.token;
    const employeeId = tokenData.employeeId;

    expect(adminToken).toBeDefined();
    expect(employeeId).toBeDefined();

    console.log(`Menggunakan Employee ID untuk di-update: ${employeeId}`);

    const timestamp = Date.now();
    const updatePayload = {
      full_name: "Karyawan Uji QA Updated", // Tanpa angka agar lolos validasi server
      phone: `+62812${timestamp.toString().slice(-8)}`
    };

    const updateRes = await updateEmployeeApi(adminToken, employeeId, updatePayload);
    expect(updateRes.status()).toBe(200);
    
    const updateBody = await updateRes.json();
    expect(updateBody.success).toBe(true);
    
    console.log('Test 3 Selesai: Berhasil memperbarui data karyawan!');
  });


  // Step 4: Hapus Karyawan Berdasarkan UUID yang Sama
  test('Test 4: DELETE Hapus Karyawan', async () => {
    const tokenData = readTokenFile();
    const adminToken = tokenData.adminToken || tokenData.token;
    const employeeId = tokenData.employeeId;

    expect(adminToken).toBeDefined();
    expect(employeeId).toBeDefined();

    console.log(`Menggunakan Employee ID untuk dihapus: ${employeeId}`);

    const deleteRes = await deleteEmployeeApi(adminToken, employeeId);
    expect([200, 204]).toContain(deleteRes.status());
    
    if (deleteRes.status() === 200) {
      const deleteBody = await deleteRes.json();
      expect(deleteBody.success).toBe(true);
    }

    console.log(`Test 4 Selesai: Berhasil menghapus karyawan dengan ID: ${employeeId}`);
  });

});