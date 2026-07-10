import { describe, it, expect } from 'vitest';
import { api, registerAndGetToken, authHeader } from './helpers.js';

describe('Budget API Endpoints', () => {
  it('should manage budget CRUD and status checking', async () => {
    // 1. Register & authenticate
    const token = await registerAndGetToken({
      email: 'budget-tester@example.com',
      username: 'budgettester',
    });
    const headers = authHeader(token);

    // 2. Create budget for Food
    const createRes = await api().post('/api/budgets').set(headers).send({
      category: 'Food',
      limit: 5000,
      month: 7,
      year: 2026,
    });

    expect(createRes.status).toBe(201);
    expect(createRes.body.success).toBe(true);
    expect(createRes.body.data.category).toBe('Food');
    expect(createRes.body.data.limit).toBe(5000);
    const budgetId = createRes.body.data._id;

    // 3. Create budget for Overall
    const overallRes = await api().post('/api/budgets').set(headers).send({
      category: 'Overall',
      limit: 20000,
      month: 7,
      year: 2026,
    });
    expect(overallRes.status).toBe(201);

    // 4. List budgets
    const listRes = await api().get('/api/budgets?month=7&year=2026').set(headers);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(2);

    // 5. Update Food budget limit to 6000
    const updateRes = await api()
      .patch(`/api/budgets/${budgetId}`)
      .set(headers)
      .send({ limit: 6000 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.limit).toBe(6000);

    // 6. Get budget status
    const statusRes = await api().get('/api/budgets/status?month=7&year=2026').set(headers);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.data.overall.limit).toBe(20000);
    expect(statusRes.body.data.categories.length).toBe(1);
    expect(statusRes.body.data.categories[0].category).toBe('Food');

    // 7. Delete Food budget
    const deleteRes = await api().delete(`/api/budgets/${budgetId}`).set(headers);
    expect(deleteRes.status).toBe(200);

    // 8. Verify deletion
    const listVerifyRes = await api().get('/api/budgets?month=7&year=2026').set(headers);
    expect(listVerifyRes.body.data.length).toBe(1); // Only overall remains
  });
});
