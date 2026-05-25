import { describe, expect, it } from 'vitest';
import { api, authHeader, registerAndGetToken } from './helpers.js';

const products = (...prices: number[]) =>
  prices.map((p, i) => ({ name: `Item ${i + 1}`, price: p, category: 'Food', label: null }));

async function addToday(token: string | undefined, prices: number[]) {
  return api()
    .post('/api/expenses')
    .set(authHeader(token))
    .send({ productsArray: products(...prices) });
}

async function balance(token: string | undefined): Promise<number> {
  const me = await api().get('/api/users/me').set(authHeader(token));
  return me.body.data.currentPocketMoney;
}

describe('expense CRUD + balance', () => {
  it('adds today expenses and deducts from balance', async () => {
    const token = await registerAndGetToken();
    const before = await balance(token);

    const res = await addToday(token, [100, 50]);
    expect(res.status).toBe(201);
    expect(res.body.data.expenses).toHaveLength(2);
    expect(res.body.data.totalDeducted).toBe(150);

    const after = await balance(token);
    expect(after).toBe(before - 150);
  });

  it('refunds the price delta when editing down', async () => {
    const token = await registerAndGetToken();
    const created = await addToday(token, [100]);
    const id = created.body.data.expenses[0]._id;
    const after1 = await balance(token);

    const edit = await api().patch(`/api/expenses/products/${id}`).set(authHeader(token)).send({
      expenseName: 'Item 1',
      expensePrice: 30,
      expenseCategory: 'Food',
      selectedLabel: null,
    });
    expect(edit.status).toBe(200);

    const after2 = await balance(token);
    expect(after2).toBe(after1 + 70); // refunded 100, charged 30
  });

  it('charges the price delta when editing up', async () => {
    const token = await registerAndGetToken();
    const created = await addToday(token, [50]);
    const id = created.body.data.expenses[0]._id;
    const after1 = await balance(token);

    await api().patch(`/api/expenses/products/${id}`).set(authHeader(token)).send({
      expenseName: 'Item 1',
      expensePrice: 80,
      expenseCategory: 'Food',
      selectedLabel: null,
    });

    const after2 = await balance(token);
    expect(after2).toBe(after1 - 30); // refunded 50, charged 80
  });

  it('refunds the full price on delete when isAddPriceToPocketMoney=true', async () => {
    const token = await registerAndGetToken();
    const created = await addToday(token, [200]);
    const id = created.body.data.expenses[0]._id;
    const after1 = await balance(token);

    const del = await api()
      .delete(`/api/expenses/products/${id}`)
      .set(authHeader(token))
      .send({ isAddPriceToPocketMoney: true });
    expect(del.status).toBe(200);

    const after2 = await balance(token);
    expect(after2).toBe(after1 + 200);
  });

  it('does NOT refund on delete when flag is false', async () => {
    const token = await registerAndGetToken();
    const created = await addToday(token, [200]);
    const id = created.body.data.expenses[0]._id;
    const after1 = await balance(token);

    await api()
      .delete(`/api/expenses/products/${id}`)
      .set(authHeader(token))
      .send({ isAddPriceToPocketMoney: false });

    const after2 = await balance(token);
    expect(after2).toBe(after1);
  });

  it('returns 404 editing an unknown id', async () => {
    const token = await registerAndGetToken();
    const res = await api()
      .patch('/api/expenses/products/507f1f77bcf86cd799439011')
      .set(authHeader(token))
      .send({ expenseName: 'X', expensePrice: 1, expenseCategory: 'Food', selectedLabel: null });
    expect(res.status).toBe(404);
  });

  it('returns todays expenses sorted newest first', async () => {
    const token = await registerAndGetToken();
    await addToday(token, [10]);
    await addToday(token, [20]);
    const today = await api().get('/api/expenses/today').set(authHeader(token));
    expect(today.status).toBe(200);
    expect(today.body.data).toHaveLength(2);
  });
});
