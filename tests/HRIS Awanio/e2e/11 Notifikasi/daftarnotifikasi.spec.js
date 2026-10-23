import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { getNotificationsApi } from '../../components/authApi'; // Pastikan fungsi getNotificationsApi sudah ditambahkan di authApi.js

test.describe('Modul Notifikasi Awanio', () => {

  test('GET Fetch Unread Notifications Berhasil & Valid', async () => {
    // 1. Baca token dari file lokal (.consultoken.json)
    const tokenData = readTokenFile();
    const token = tokenData.adminToken || tokenData.token || tokenData.newEmployeeToken;
    expect(token).toBeDefined();

    // 2. Panggil API get notifications dengan parameter query
    const res = await getNotificationsApi(token, {
      only_unread: 'true',
      page: 1,
      limit: 20
    });

    // 3. Validasi Status HTTP & Response Success
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    // 4. Validasi Struktur Array Data Notifikasi
    expect(Array.isArray(body.data)).toBe(true);
    
    if (body.data.length > 0) {
      const firstNotif = body.data[0];
      
      // Memastikan properti penting dalam objek notifikasi tersedia
      expect(firstNotif).toHaveProperty('id');
      expect(firstNotif).toHaveProperty('type');
      expect(firstNotif).toHaveProperty('title');
      expect(firstNotif).toHaveProperty('message');
      expect(firstNotif).toHaveProperty('is_read');
      
      // Karena kita filter only_unread=true, pastikan is_read bernilai false
      expect(firstNotif.is_read).toBe(false);
      
      console.log(`Berhasil mengambil ${body.data.length} notifikasi belum dibaca.`);
      console.log(`Contoh Judul Notifikasi Teratas: "${firstNotif.title}"`);
    } else {
      console.log('Tidak ada notifikasi yang belum dibaca saat ini.');
    }

    // 5. Validasi Objek Metadata (Pagination & Total Unread)
    expect(body).toHaveProperty('meta');
    expect(body.meta).toHaveProperty('page', 1);
    expect(body.meta).toHaveProperty('limit', 20);
    expect(typeof body.meta.total).toBe('number');
    expect(typeof body.meta.unread).toBe('number');

    console.log(`Total Unread dari Meta: ${body.meta.unread}`);
  });

});