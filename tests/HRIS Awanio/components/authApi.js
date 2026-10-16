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

// API untuk mengambil list Department secara dinamis
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

export async function updateEmployeeApi(adminToken, employeeId, updateData) {
  const apiContext = await request.newContext();
  const res = await apiContext.patch(`${BASE_URL}/employees/${employeeId}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    data: updateData, 
  });
  return res;
}

export async function deleteEmployeeApi(adminToken, employeeId) {
  const apiContext = await request.newContext();
  const res = await apiContext.delete(`${BASE_URL}/employees/${employeeId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
  });
  return res;
}