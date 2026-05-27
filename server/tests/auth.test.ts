import { describe, expect, it } from 'vitest';
import { api, authHeader, register, registerAndGetToken, sample } from './helpers.js';

describe('auth', () => {
  it('registers a user and returns a token', async () => {
    const res = await register();
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeTypeOf('string');
    expect(res.body.data.user.email).toBe(sample.email);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    await register();
    const dup = await register({ username: 'other' });
    expect(dup.status).toBe(409);
  });

  it('logs in with email + password', async () => {
    await register();
    const res = await api()
      .post('/api/auth/login')
      .send({ email: sample.email, password: sample.password });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTypeOf('string');
  });

  it('logs in with username + password', async () => {
    await register();
    const res = await api()
      .post('/api/auth/login')
      .send({ username: sample.username, password: sample.password });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTypeOf('string');
  });

  it('rejects bad password', async () => {
    await register();
    const res = await api()
      .post('/api/auth/login')
      .send({ email: sample.email, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('blocks /users/me without a token', async () => {
    const res = await api().get('/api/users/me');
    expect(res.status).toBe(401);
  });

  it('returns the current user for a valid token', async () => {
    const token = await registerAndGetToken();
    const res = await api().get('/api/users/me').set(authHeader(token));
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(sample.email);
    expect(res.body.data.currentSession).toHaveLength(1);
  });

  it('logout invalidates the session', async () => {
    const token = await registerAndGetToken();
    const out = await api().post('/api/auth/logout').set(authHeader(token));
    expect(out.status).toBe(200);

    const after = await api().get('/api/users/me').set(authHeader(token));
    expect(after.status).toBe(401);
  });
});
