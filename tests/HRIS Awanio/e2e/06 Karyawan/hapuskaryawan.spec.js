import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { deleteEmployeeApi } from '../../components/authApi';

test.describe('Modul Hapus Karyawan Awanio', () => {

  test('DELETE Karyawan Berdasarkan ID Tersimpan', async () => {
    // Membaca token admin dan employeeId (UUID) yang sama dari .consultoken.json
    const tokenData = readTokenFile();
    const adminToken = tokenData.adminToken || tokenData.token;
    const employeeId = tokenData.employeeId;

    expect(adminToken).toBeDefined();
    expect(employeeId).toBeDefined();

    console.log(`Menggunakan Employee ID untuk dihapus: ${employeeId}`);

    // Panggil API Delete
    const deleteRes = await deleteEmployeeApi(adminToken, employeeId);

    // Validasi Response (Status 200 OK atau 204 No Content)
    expect([200, 204]).toContain(deleteRes.status());
    
    if (deleteRes.status() === 200) {
      const deleteBody = await deleteRes.json();
      expect(deleteBody.success).toBe(true);
    }

    console.log(`Berhasil menghapus karyawan dengan ID: ${employeeId}`);
  });

});