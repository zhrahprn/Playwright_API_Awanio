import { test, expect, request } from '@playwright/test';

test('GET health check', async () => {
  const apiContext = await request.newContext();
  const res = await apiContext.get('https://api.hris.click/health', {
    headers: {
      'Accept': 'application/json',
    },
  });

  // Validasi status code harus 200 OK
  expect(res.status()).toBe(200);

  const body = await res.json();
  
  // Validasi respons JSON sesuai server running
  expect(body.success).toBe(true);
  expect(body.message).toBe('Server running');
  expect(body.redis).toBe('ready');
});