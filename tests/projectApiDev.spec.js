import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ORGANIZATION_UUID = 'de7fe0c8-7822-4b65-8fb8-6cf0319c4c18';
const PROJECT_NAME = `test-automation-${Date.now()}`;
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

  const res = await apiContext.post('https://api-dev-v2.awan.io/v2/accounts/login', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'text/plain;charset=UTF-8',
    },
    data: JSON.stringify({
      username: 'zahrahh1',
      password: 'Zahrah1,',
    }),
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.username).toBe('zahrahh1');

  writeTokenFile({ token: body.data.token });
});

test('create project - berhasil', async () => {
  const { token } = readTokenFile();
  const apiContext = await request.newContext();

  const res = await apiContext.post('https://api-dev-v2.awan.io/v2/projects', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    data: {
      name: PROJECT_NAME,
      organization_uuid: ORGANIZATION_UUID,
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.name).toBe(PROJECT_NAME);
  expect(body.data.organization.uuid).toBe(ORGANIZATION_UUID);

  writeTokenFile({ projectUuid: body.data.uuid });
});

test('update project - berhasil', async () => {
  const { token, projectUuid } = readTokenFile();
  const updatedName = `${PROJECT_NAME}-update`;
  const apiContext = await request.newContext();

  const res = await apiContext.put(`https://api-dev-v2.awan.io/v2/projects/${projectUuid}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    data: {
      name: updatedName,
      icon: null,
      organization_uuid: ORGANIZATION_UUID,
      project_members_added: [],
      project_members_updated: [],
      project_members_deleted: [],
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data.name).toBe(updatedName);
  expect(body.data.uuid).toBe(projectUuid);
});

test('delete project - berhasil', async () => {
  const { token, projectUuid } = readTokenFile();
  const apiContext = await request.newContext();

  const res = await apiContext.delete(`https://api-dev-v2.awan.io/v2/projects/${projectUuid}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.result).toBe(true);
  expect(body.data).toBe('deleted');
});