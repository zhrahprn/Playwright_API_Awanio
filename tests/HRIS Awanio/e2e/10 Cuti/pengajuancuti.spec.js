import { test, expect } from '@playwright/test';
import { readTokenFile, writeTokens } from '../../components/authHelper';
import { createLeaveRequestApi, loginEmployeeApi, createEmployeeApi, getDepartmentsApi, verifyEmailApi, getVerificationCodeApi } from '../../components/authApi';
import { newEmployeeData } from '../../data/authData';

test.describe('Modul Pengajuan Cuti Karyawan Awanio', () => {

  test('POST Ajukan Cuti Tahunan Berhasil', async () => {
    const tokenData = readTokenFile();
    const adminToken = tokenData.adminToken || tokenData.token;
    expect(adminToken).toBeDefined();

    // 1. Ambil departemen dinamis 
    const deptRes = await getDepartmentsApi(adminToken);
    expect(deptRes.status()).toBe(200);
    const departments = (await deptRes.json()).data;
    
    const targetDept = departments.find(d => 
      d.name.toLowerCase().includes('artificial intelligence') || 
      d.name.toLowerCase().includes('ai')
    ) || departments[0];
    
    const dynamicDepartmentId = targetDept.id;
    console.log(`Menggunakan Departemen: ${targetDept.name} (ID: ${dynamicDepartmentId})`);

    const timestamp = Date.now();
    const employeePayload = {
      ...newEmployeeData,
      email: `qa.cuti.${timestamp}@example.com`,
      phone: `+62877${timestamp.toString().slice(-7)}`,
      employee_number: `5${timestamp.toString().slice(-4)}`,
      department_id: dynamicDepartmentId,
    };

    const createRes = await createEmployeeApi(adminToken, employeePayload);
    expect(createRes.status()).toBe(201);
    const createBody = await createRes.json();
    const createdEmployeeId = createBody.data?.employee?.id || createBody.data?.id;
    expect(createdEmployeeId).toBeDefined();

    // verifikasi akun
    let verificationCode = createBody.data?.verification_code || createBody.data?.code;
    if (!verificationCode) {
      const codeRes = await getVerificationCodeApi(adminToken, employeePayload.email);
      if (codeRes.status() === 200) {
        verificationCode = (await codeRes.json()).data?.code;
      }
    }

    if (verificationCode) {
      await verifyEmailApi({ email: employeePayload.email, code: verificationCode });
    }

    //Login menggunakan akun yang baru dibuat u
    const loginRes = await loginEmployeeApi({
      email: employeePayload.email,
      password: newEmployeeData.password,
    });
    
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    const employeeToken = loginBody.token || loginBody.data?.token;
    expect(employeeToken).toBeDefined();

    // Simpan token dan employeeId 
    writeTokens({
      adminToken: adminToken,
      employeeToken: employeeToken,
      newEmployeeToken: employeeToken,
      employeeId: createdEmployeeId
    });
    console.log('Token dan Employee ID berhasil disimpan ke .consultoken.json');

    // Set tanggal cuti secara dinamis
    const today = new Date();
    const startDateObj = new Date(today);
    startDateObj.setDate(today.getDate() + 3);
    const startDate = startDateObj.toISOString().split('T')[0];

    const endDateObj = new Date(today);
    endDateObj.setDate(today.getDate() + 4);
    const endDate = endDateObj.toISOString().split('T')[0];

    // Payload cuti didefinisikan secara langsung untuk menghindari error undefined
    const leavePayload = {
      leave_type_id: "d9f5b10a-a22d-4a91-9adf-82ec0b78a5c7",
      start_date: startDate,
      end_date: endDate,
      reason: "Pulang kapung"
    };

    console.log(`Mengajukan cuti dari tanggal ${startDate} sampai ${endDate}`);

    //kirim request pengajuan cuti
    const res = await createLeaveRequestApi(employeeToken, leavePayload);

    if (res.status() !== 200 && res.status() !== 201) {
      console.log('GAGAL MENGAJUKAN CUTI:', await res.json());
    }
    
    expect([200, 201]).toContain(res.status());
    const responseBody = await res.json();
    expect(responseBody.success).toBe(true);

    console.log('Pengajuan cuti tahunan berhasil dibuat:', responseBody);
  });

});