import { describe, expect, it } from 'vitest';
import { api, authHeader, registerAndGetToken } from './helpers.js';

interface FeedItem {
  category: string;
  name: string;
}

async function seed(token: string | undefined, n: number): Promise<void> {
  const productsArray = Array.from({ length: n }, (_, i) => ({
    name: `Item ${i}`,
    price: 1 + i,
    category: i % 2 === 0 ? 'Food' : 'Groceries',
    label: null,
  }));
  await api().post('/api/expenses').set(authHeader(token)).send({ productsArray });
}

describe('expense feed pagination', () => {
  it('returns 10 per page and hasMore flag', async () => {
    const token = await registerAndGetToken();
    await seed(token, 25);

    const p0 = await api().get('/api/expenses/feed?page=0&limit=10').set(authHeader(token));
    expect(p0.status).toBe(200);
    expect(p0.body.data.items).toHaveLength(10);
    expect(p0.body.data.total).toBe(25);
    expect(p0.body.data.hasMore).toBe(true);

    const p2 = await api().get('/api/expenses/feed?page=2&limit=10').set(authHeader(token));
    expect(p2.body.data.items).toHaveLength(5);
    expect(p2.body.data.hasMore).toBe(false);
  });

  it('filters by category', async () => {
    const token = await registerAndGetToken();
    await seed(token, 10); // 5 Food, 5 Groceries

    const res = await api()
      .get('/api/expenses/feed?page=0&limit=10&category=Food')
      .set(authHeader(token));
    expect(res.body.data.total).toBe(5);
    expect(res.body.data.items.every((i: FeedItem) => i.category === 'Food')).toBe(true);
  });

  it('filters by search (case-insensitive)', async () => {
    const token = await registerAndGetToken();
    await seed(token, 5);

    const res = await api()
      .get('/api/expenses/feed?page=0&limit=10&search=item%202')
      .set(authHeader(token));
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.items[0].name).toBe('Item 2');
  });

  it('search matches label as well as name', async () => {
    const token = await registerAndGetToken();
    await api()
      .post('/api/expenses')
      .set(authHeader(token))
      .send({
        productsArray: [
          { name: 'Coffee', price: 5, category: 'Food', label: 'work-trip' },
          { name: 'Notebook', price: 10, category: 'Educational', label: null },
        ],
      });

    const res = await api()
      .get('/api/expenses/feed?page=0&limit=10&search=work-trip')
      .set(authHeader(token));
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.items[0].name).toBe('Coffee');
  });
});
