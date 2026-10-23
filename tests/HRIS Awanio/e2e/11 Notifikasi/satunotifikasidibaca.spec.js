import { test, expect } from '@playwright/test';
import { readTokenFile } from '../../components/authHelper';
import { getNotificationsApi, markNotificationAsReadApi } from '../../components/authApi';

test.describe('Modul Notifikasi Awanio - Tandai Dibaca', () => {

  test('PATCH Mark Single Notification as Read Berhasil & Valid', async () => {
    // 1. Baca token dari file lokal (.consultoken.json)
    const tokenData = readTokenFile();
    const token = tokenData.adminToken || tokenData.token || tokenData.newEmployeeToken;
    expect(token).toBeDefined();

    // 2. Ambil daftar notifikasi terlebih dahulu untuk mendapatkan ID notifikasi yang belum dibaca (is_read: false)
    const listRes = await getNotificationsApi(token, { only_unread: 'true', page: 1, limit: 5 });
    expect(listRes.status()).toBe(200);
    const listBody = await listRes.json();
    
    // Pastikan ada notifikasi yang bisa dites
    if (!listBody.data || listBody.data.length === 0) {
      console.log('Peringatan: Tidak ada notifikasi unread yang tersedia untuk diuji.');
      return;
    }

    // Ambil ID dari notifikasi pertama yang statusnya belum dibaca
    const targetNotificationId = listBody.data[0].id;
    console.log(`Menguji penandaan dibaca untuk ID Notifikasi: ${targetNotificationId}`);

    // 3. Panggil API untuk menandai notifikasi tersebut sebagai dibaca
    const res = await markNotificationAsReadApi(token, targetNotificationId);

    // 4. Validasi Status HTTP & Response Success
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Notification marked as read');

    // 5. Validasi Struktur Objek Data (Memastikan is_read berubah jadi true & ada read_at)
    expect(body).toHaveProperty('data');
    expect(body.data.id).toBe(targetNotificationId);
    expect(body.data.is_read).toBe(true);
    expect(body.data.read_at).not.toBeNull(); // Memastikan timestamp dibaca terisi

    // 6. Validasi Meta sisa unread
    expect(body).toHaveProperty('meta');
    expect(typeof body.meta.unread).toBe('number');

    console.log(`Berhasil! Notifikasi ${targetNotificationId} telah ditandai sebagai dibaca. Sisa unread: ${body.meta.unread}`);
  });

});