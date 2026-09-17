import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ORGANIZATION_UUID = '0bfbb346-b0c9-4f8d-8699-fe66d0fac4f9';
const PROJECT_NAME = 'test-automation-satu';
const TOKEN_FILE = path.resolve(__dirname, '../../playwright/.auth/api-token.json');

function readTokenFile() {
  return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
}

function writeTokenFile(data) {
  fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
  const existing = fs.existsSync(TOKEN_FILE) ? readTokenFile() : {};
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ ...existing, ...data }));
}

test('login api - berhasil', async () => {
  const apiContext = await request.newContext();

  const res = await apiContext.post('https://api.demo.awanio.com/v2/accounts/login', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      username: 'zhrahprn',
      password: 'Zz010904,',
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.username).toBe('zhrahprn');

  writeTokenFile({ token: body.data.token });
});

test('create project - berhasil', async () => {
  // ambil token dari file hasil test login (tidak login lagi)
  const { token } = readTokenFile();

  const apiContext = await request.newContext();

  const res = await apiContext.post('https://api.demo.awanio.com/v2/projects', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'text/plain;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    data: JSON.stringify({
      name: PROJECT_NAME,
      organization_uuid: ORGANIZATION_UUID,
    }),
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.name).toBe(PROJECT_NAME);
  expect(body.data.organization.uuid).toBe(ORGANIZATION_UUID);

  // simpan uuid project yang baru dibuat, supaya test update bisa pakai
  writeTokenFile({ projectUuid: body.data.uuid });
});

test('update project - berhasil', async () => {
  // ambil token & uuid project dari file hasil test login + create (tidak login/create lagi)
  const { token, projectUuid } = readTokenFile();
  const updatedName = `${PROJECT_NAME}-update`;

  const apiContext = await request.newContext();

  const res = await apiContext.put(`https://api.demo.awanio.com/v2/projects/${projectUuid}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'text/plain;charset=UTF-8',
      'Authorization': `Bearer ${token}`,
    },
    data: JSON.stringify({
      name: updatedName,
      icon: null,
      organization_uuid: ORGANIZATION_UUID,
      project_members_added: [],
      project_members_updated: [],
      project_members_deleted: [],
    }),
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.name).toBe(updatedName);
  expect(body.data.uuid).toBe(projectUuid);
});