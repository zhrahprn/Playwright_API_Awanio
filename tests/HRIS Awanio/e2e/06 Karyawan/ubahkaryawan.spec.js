import { test, expect } from '@playwright/test';
import { readTokenFile, writeTokens } from '../../components/authHelper';
import { updateEmployeeApi, createEmployeeApi, getDepartmentsApi } from '../../components/authApi';
import { newEmployeeData } from '../../data/authData';

test.describe('Modul Ubah Karyawan Awanio', () => {

  test('PUT Update Data Karyawan Berdasarkan ID Tersimpan', async () => {
    const tokenData = readTokenFile();
    const adminToken = tokenData.adminToken || tokenData.token;
    expect(adminToken).toBeDefined();

    // Best Practice: Selalu buat data baru secara independen agar tidak bergantung pada state file lama yang mungkin sudah terhapus
    const deptRes = await getDepartmentsApi(adminToken);
    const dynamicDepartmentId = (await deptRes.json()).data[0].id;
    
    const timestamp = Date.now();
    const createRes = await createEmployeeApi(adminToken, {
      ...newEmployeeData,
      email: `qa.update.${timestamp}@example.com`,
      phone: `+62899${timestamp.toString().slice(-7)}`,
      employee_number: `3${timestamp.toString().slice(-4)}`,
      department_id: dynamicDepartmentId,
    });
    
    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    const employeeId = createBody.data.employee.id;
    writeTokens({ employeeId });

    console.log(`Menggunakan Employee ID baru untuk di-update: ${employeeId}`);

    const updatePayload = {
      full_name: `Karyawan Update ${timestamp.toString().slice(-4)}`,
      phone: `+62812${timestamp.toString().slice(-8)}`
    };

    const updateRes = await updateEmployeeApi(adminToken, employeeId, updatePayload);

    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.success).toBe(true);
    
    console.log('Berhasil memperbarui data karyawan dengan nama baru:', updatePayload.full_name);
  });

});