import fs from 'fs';
import path from 'path';

const TOKEN_FILE = path.resolve(__dirname, '../../../../.consultoken.json');

export function readTokenFile() {
  if (!fs.existsSync(TOKEN_FILE)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
}

export function writeTokens(data) {
  fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
  const existing = fs.existsSync(TOKEN_FILE) ? readTokenFile() : {};
  // Menggabungkan token lama dengan token baru secara otomatis
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ ...existing, ...data }, null, 2));
}

