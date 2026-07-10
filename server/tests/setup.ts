// Synchronous env stubs — must run before any module imports config/env.js.
// Placeholder MONGO_URL is overridden in beforeAll once MongoMemoryServer boots.
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.MONGO_URL = 'mongodb://placeholder';
process.env.ACCESS_TOKEN_SECRET_KEY = 'test-access-secret';
process.env.ACCESS_TOKEN_SECRET_EXPIRY = '1h';
process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET = 'test-verify-secret';
process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET_EXPIRY = '1d';
process.env.RESET_PASSWORD_TOKEN_SECRET = 'test-reset-secret';
process.env.RESET_PASSWORD_TOKEN_SECRET_EXPIRY = '15m';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.SERVER_URL = 'http://localhost:5000';
process.env.ADMIN_GMAIL = 'admin@example.com';
process.env.RESEND_API_KEY = 're_test-key';
process.env.TRUST_PROXY_HOPS = '0';

import { execSync } from 'child_process';
import fs from 'fs';

// Try to locate system-wide mongod to avoid download issues & SIGSEGV on Ubuntu 24.04
if (!process.env.MONGOMS_SYSTEM_BINARY) {
  try {
    const systemMongod = execSync('which mongod', { encoding: 'utf8' }).trim();
    if (systemMongod && fs.existsSync(systemMongod)) {
      process.env.MONGOMS_SYSTEM_BINARY = systemMongod;
    }
  } catch (err) {
    // If 'which mongod' fails or mongod is not installed, fallback to default mongodb-memory-server download
  }
}

import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll } from 'vitest';

// Declare mongod type as any to avoid static import type reference issues
let mongod: any;

beforeAll(async () => {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongod.getUri();
  await mongoose.connect(process.env.MONGO_URL);
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const c of collections) await c.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});
