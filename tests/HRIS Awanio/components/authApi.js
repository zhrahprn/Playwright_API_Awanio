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