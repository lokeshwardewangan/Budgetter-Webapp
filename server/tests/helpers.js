import request from 'supertest';
import { app } from '../src/app.js';

export const api = () => request(app);

export const sample = {
  username: 'tester',
  name: 'Test User',
  email: 'tester@example.com',
  password: 'password123',
};

export async function register(overrides = {}) {
  return api()
    .post('/api/auth/register')
    .send({ ...sample, ...overrides });
}

export async function loginAndGetToken(overrides = {}) {
  const creds = { email: sample.email, password: sample.password, ...overrides };
  const res = await api().post('/api/auth/login').send(creds);
  return res.body?.data?.token;
}

export async function registerAndGetToken(overrides = {}) {
  const res = await register(overrides);
  return res.body?.data?.token;
}

export const authHeader = (token) => ({ Authorization: `Bearer ${token}` });
