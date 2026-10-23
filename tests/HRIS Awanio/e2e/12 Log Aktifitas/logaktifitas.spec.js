import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { getActivityLogsApi } from '../../components/authApi'; // Pastikan fungsi getActivityLogsApi sudah ditambahkan di authApi.js

test.describe('Modul Log Aktivitas Awanio', () => {

  test('GET Fetch Activity Logs Berhasil & Struktur Valid', async () => {
    // 1. Baca token admin dari file lokal (.consultoken.json)
    const tokenData = readTokenFile();
    const token = tokenData.adminToken || tokenData.token;
    expect(token).toBeDefined();

    // 2. Panggil API get activity logs dengan parameter query
    const res = await getActivityLogsApi(token, {
      page: 1,
      limit: 20
    });

    // 3. Validasi Status HTTP & Response Success
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    // 4. Validasi Struktur Array Data Log Aktivitas
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    // Ambil log teratas untuk memvalidasi atribut penting di dalamnya
    const firstLog = body.data[0];
    
    expect(firstLog).toHaveProperty('id');
    expect(firstLog).toHaveProperty('action');
    expect(firstLog).toHaveProperty('status'); // Contoh: "success" atau "failed"
    expect(firstLog).toHaveProperty('actor_email');
    expect(firstLog).toHaveProperty('entity');
    expect(firstLog).toHaveProperty('summary');
    expect(firstLog).toHaveProperty('occurred_at');

    console.log(`Berhasil mengambil ${body.data.length} log aktivitas.`);
    console.log(`Contoh Log Teratas - Action: "${firstLog.action}", Status: "${firstLog.status}", Summary: "${firstLog.summary}"`);

    // 5. Validasi Objek Metadata (Paginasi & Total Data)
    expect(body).toHaveProperty('meta');
    expect(body.meta).toHaveProperty('page', 1);
    expect(body.meta).toHaveProperty('limit', 20);
    expect(typeof body.meta.total).toBe('number');
    expect(typeof body.meta.total_pages).toBe('number');

    console.log(`Total Log Aktivitas di Server: ${body.meta.total}`);
  });

});