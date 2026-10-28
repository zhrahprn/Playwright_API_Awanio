import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { 
  loginEmployeeApi, 
  createLeaveRequestApi,
  rejectLeaveRequestApi,
  approveLeaveRequestApi 
} from '../../components/authApi';

test.describe.serial('Pengajuan, Penolakan dan Persetujuan Cuti', () => {
  let employeeToken;
  let managerToken;
  let leaveRequestId;

  // Lakukan login karyawan sebelum seluruh test dijalankan
  test.beforeAll(async () => {
    const loginEmpRes = await loginEmployeeApi({
      email: 'citra.maharani@hris.click',
      password: '12345678',
    });
    expect(loginEmpRes.status()).toBe(200);
    const loginEmpBody = await loginEmpRes.json();
    employeeToken = loginEmpBody.token || loginEmpBody.data?.token;
  });

  // Test Case 1 : Employee Mengajukan Cuti
  test('POST Employee mengajukan cuti', async () => {
    expect(employeeToken).toBeDefined();

    // Payload cuti pertama
    const leavePayload = {
      leave_type_id: "d9f5b10a-a22d-4a91-9adf-82ec0b78a5c7",
      start_date: "2026-11-20",
      end_date: "2026-11-21",
      reason: "Keperluan pribadi"
    };

    const leaveRes = await createLeaveRequestApi(employeeToken, leavePayload);
    
    if (leaveRes.status() !== 200 && leaveRes.status() !== 201) {
      console.log('Gagal Ajukan Cuti:', await leaveRes.json());
    }

    expect([200, 201]).toContain(leaveRes.status());
    
    const leaveResponseBody = await leaveRes.json();
    expect(leaveResponseBody.success).toBe(true);
    
    leaveRequestId = leaveResponseBody.data?.id || leaveResponseBody.id;
    expect(leaveRequestId).toBeDefined();
    console.log(`Cuti berhasil diajukan dengan ID: ${leaveRequestId}`);
  });


  // 2. Test Case 2: Cuti Ditolak oleh Atasan
  test('PATCH Cuti di tolak', async () => {
    // Login menggunakan akun Kevin Wijaya (Atasan)
    const loginMgrRes = await loginEmployeeApi({
      email: 'kevin.wijaya@hris.click',
      password: '12345678',
    });
    expect(loginMgrRes.status()).toBe(200);
    const loginMgrBody = await loginMgrRes.json();
    managerToken = loginMgrBody.token || loginMgrBody.data?.token;
    expect(managerToken).toBeDefined();

    expect(leaveRequestId).toBeDefined();

    const rejectRes = await rejectLeaveRequestApi(managerToken, leaveRequestId, "Mohon ajukan di tanggal lain");
    
    if (rejectRes.status() !== 200) {
      console.log('Respons Reject:', await rejectRes.json());
    }

    expect(rejectRes.status()).toBe(200);
    const rejectBody = await rejectRes.json();
    expect(rejectBody.success).toBe(true);

    console.log(`Cuti dengan ID ${leaveRequestId} berhasil ditolak oleh Atasan.`);
  });


  // 3. Test Case 3: Employee Mengajukan Cuti Lagi
  test('POST Employee mengajukan lagi', async () => {
    expect(employeeToken).toBeDefined();

    const leavePayload = {
      leave_type_id: "d9f5b10a-a22d-4a91-9adf-82ec0b78a5c7",
      start_date: "2026-11-25", // Ubah tanggal sedikit agar tidak bentrok dengan cuti pertama
      end_date: "2026-11-26",
      reason: "Revisi pengajuan cuti keperluan keluarga"
    };

    const leaveRes = await createLeaveRequestApi(employeeToken, leavePayload);
    expect([200, 201]).toContain(leaveRes.status());
    
    const leaveResponseBody = await leaveRes.json();
    console.log('Struktur Respons Cuti Kedua:', leaveResponseBody); 
    
    expect(leaveResponseBody.success).toBe(true);
    
    leaveRequestId = leaveResponseBody.data?.id || leaveResponseBody.id || leaveResponseBody.data?.leave_request_id;
    expect(leaveRequestId).toBeDefined();
    console.log(`Cuti kedua berhasil diajukan ulang dengan ID: ${leaveRequestId}`);
  });


  // 4. Test Case 4: Baru di-Approve oleh Atasan
  test('PATCH Cuti di approve', async () => {
    const loginMgrRes = await loginEmployeeApi({
      email: 'kevin.wijaya@hris.click',
      password: '12345678',
    });
    expect(loginMgrRes.status()).toBe(200);
    const loginMgrBody = await loginMgrRes.json();
    managerToken = loginMgrBody.token || loginMgrBody.data?.token;
    expect(managerToken).toBeDefined();

    expect(leaveRequestId).toBeDefined();

    const approveRes = await approveLeaveRequestApi(managerToken, leaveRequestId);
    
    if (approveRes.status() !== 200) {
      console.log('Respons Approve:', await approveRes.json());
    }

    expect(approveRes.status()).toBe(200);
    const approveBody = await approveRes.json();
    expect(approveBody.success).toBe(true);

    console.log('Pengajuan cuti berhasil disetujui (Approved) oleh Atasan:', approveBody);
  });

});