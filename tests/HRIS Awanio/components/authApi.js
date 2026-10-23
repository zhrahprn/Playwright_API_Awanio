import { request } from '@playwright/test';

const BASE_URL = process.env.BASE_URL;

export async function loginAdminApi(loginData) {
  const apiContext = await request.newContext();
  const res = await apiContext.post(`${BASE_URL}/auth/login`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: loginData,
  });
  return res;
}

export async function loginEmployeeApi(loginData) {
  const apiContext = await request.newContext();
  const res = await apiContext.post(`${BASE_URL}/auth/login`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: loginData,
  });
  return res;
}

export async function getProfileApi(token) {
  const apiContext = await request.newContext();
  const res = await apiContext.get(`${BASE_URL}/auth/me`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return res;
}

export async function createEmployeeApi(adminToken, employeeData) {
  const apiContext = await request.newContext();
  const res = await apiContext.post(`${BASE_URL}/employees`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    data: employeeData,
  });
  return res;
}

// list data departement dinamis 
export async function getDepartmentsApi(adminToken) {
  const apiContext = await request.newContext();
  const res = await apiContext.get(`${BASE_URL}/departments`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  return res;
}

// Mengambil kode verifikasi berdasarkan email dengan token admin
export async function getVerificationCodeApi(adminToken, email) {
  const apiContext = await request.newContext();
  const res = await apiContext.get(`${BASE_URL}/auth/verification-code?email=${encodeURIComponent(email)}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  return res;
}

// Endpoint verifikasi akun 
export async function verifyEmailApi(verifyData) {
  const apiContext = await request.newContext();
  const res = await apiContext.post(`${BASE_URL}/auth/verify`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: verifyData,
  });
  return res;
}

// Update data karyawan berdasarkan ID
export async function updateEmployeeApi(token, employeeId, updateData) {
  const apiContext = await request.newContext();
  const res = await apiContext.patch(`${BASE_URL}/employees/${employeeId}`, { // Ubah PUT jadi PATCH
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    data: updateData,
  });
  return res;
}

// Hapus karyawan berdasarkan ID
export async function deleteEmployeeApi(token, employeeId) {
  const apiContext = await request.newContext();
  const res = await apiContext.delete(`${BASE_URL}/employees/${employeeId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return res;
}

// Tambahkan di authApi.js jika belum ada
export async function getNotificationsApi(token, params = { only_unread: 'true', page: 1, limit: 20 }) {
  const apiContext = await request.newContext();
  const queryParams = new URLSearchParams(params).toString();
  
  const res = await apiContext.get(`${BASE_URL}/notifications?${queryParams}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return res;
}

// Tambahkan di authApi.js jika belum ada
export async function getActivityLogsApi(token, params = { page: 1, limit: 20 }) {
  const apiContext = await request.newContext();
  const queryParams = new URLSearchParams(params).toString();
  
  const res = await apiContext.get(`${BASE_URL}/activity-logs?${queryParams}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return res;
}

// Menandai satu notifikasi sebagai sudah dibaca (Mark as read)
export async function markNotificationAsReadApi(token, notificationId) {
  const apiContext = await request.newContext();
  
  // Menggunakan method PATCH (atau PUT tergantung backend, umumnya PATCH untuk update status parsial)
  const res = await apiContext.patch(`${BASE_URL}/notifications/${notificationId}/read`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return res;
}

// Menandai semua notifikasi sebagai sudah dibaca (Mark all as read)
export async function markAllNotificationsAsReadApi(token) {
  const apiContext = await request.newContext();
  
  const res = await apiContext.patch(`${BASE_URL}/notifications/read-all`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return res;
}

  