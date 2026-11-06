import { test, expect } from '@playwright/test';
import { 
  loginEmployeeApi, 
  getTodayAttendanceApi, 
  checkInAttendanceApi 
} from '../../components/authApi';

test.describe.serial('Skenario Pengujian Absensi Harian Awanio', () => {
  let employeeToken;

  // 1. Login terlebih dahulu sebelum pengujian absensi
  test.beforeAll(async () => {
    const loginRes = await loginEmployeeApi({
      email: '	zohran.managerproductmanagement@hris.click',
      password: '12345678',
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    employeeToken = loginBody.token || loginBody.data?.token;
    expect(employeeToken).toBeDefined();
  });

  // 2. Test Case 1: Mengecek status absensi hari ini (GET /attendances/today)
  test('GET Cek status absensi hari ini (/attendances/today)', async () => {
    expect(employeeToken).toBeDefined();

    const attendanceRes = await getTodayAttendanceApi(employeeToken);
    
    if (attendanceRes.status() !== 200) {
      console.log('Gagal Ambil Status Absensi:', await attendanceRes.json());
    }

    expect(attendanceRes.status()).toBe(200);
    const responseBody = await attendanceRes.json();
    expect(responseBody.success).toBe(true);

    console.log('Status Absensi Hari Ini:', responseBody.data);
  });

  // 3. Test Case 2: Melakukan Check-in (POST /attendances/check-in)
  test('POST Melakukan Check-in', async () => {
    expect(employeeToken).toBeDefined();

    const checkInPayload = {
      note: "Check-in tepat waktu",
      offline_time: new Date().toISOString() // Menggunakan format waktu dinamis sesuai standar ISO
    };

    const checkInRes = await checkInAttendanceApi(employeeToken, checkInPayload);
    
    if (checkInRes.status() !== 200 && checkInRes.status() !== 201) {
      console.log('Gagal Check-in:', await checkInRes.json());
    }

    if (checkInRes.status() !== 200 && checkInRes.status() !== 201 && checkInRes.status() !== 400) {
      console.log('Gagal Check-in:', await checkInRes.json());
    }

    expect([200, 201, 400]).toContain(checkInRes.status());
    const checkInBody = await checkInRes.json();
    console.log('Berhasil Check-in:', checkInBody);
  });

}); 