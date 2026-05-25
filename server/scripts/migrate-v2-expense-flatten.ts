// One-shot migration: convert per-day Expense documents with embedded
// products[] arrays into one document per expense line.
//
// Old shape: { _id, user, date, products: [{name, price, category, label, _id, createdAt}, ...] }
// New shape: { _id, user, date, name, price, category, label, createdAt, updatedAt }
//
// Reuses the original product._id so any client references still resolve.
// Idempotent: skips docs that don't have a `products` array.
//
// Run AFTER migrate-v2-types.js (which converts date String → Date).

import mongoose from 'mongoose';
import type { ObjectId } from 'mongodb';
import { env } from '../src/shared/config/env.js';

interface FlatExpense {
  _id: ObjectId;
  user: ObjectId;
  date: Date;
  name: string;
  price: number;
  category: string;
  label: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function run(): Promise<void> {
  await mongoose.connect(env.MONGO_URL);
  const db = mongoose.connection.db;
  if (!db) throw new Error('No DB connection');
  const coll = db.collection('expenses');
  console.log(`Connected to ${db.databaseName}\n`);

  const cursor = coll.find({ products: { $type: 'array' } });
  let dayDocsScanned = 0;
  const flatDocsToInsert: FlatExpense[] = [];
  const dayDocIdsToDelete: ObjectId[] = [];

  for await (const doc of cursor) {
    dayDocsScanned++;
    if (!Array.isArray(doc.products) || doc.products.length === 0) {
      dayDocIdsToDelete.push(doc._id);
      continue;
    }
    for (const p of doc.products) {
      flatDocsToInsert.push({
        _id: p._id || new mongoose.Types.ObjectId(),
        user: doc.user,
        date: doc.date,
        name: p.name,
        price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
        category: p.category,
        label: p.label ?? null,
        createdAt: p.createdAt || doc.createdAt || new Date(),
        updatedAt: p.updatedAt || doc.updatedAt || new Date(),
      });
    }
    dayDocIdsToDelete.push(doc._id);
  }

  if (flatDocsToInsert.length) {
    await coll.insertMany(flatDocsToInsert, { ordered: false });
  }
  if (dayDocIdsToDelete.length) {
    await coll.deleteMany({ _id: { $in: dayDocIdsToDelete } });
  }

  console.log(`day-docs scanned   ${dayDocsScanned}`);
  console.log(`flat docs inserted ${flatDocsToInsert.length}`);
  console.log(`day-docs deleted   ${dayDocIdsToDelete.length}`);

  await mongoose.disconnect();
  console.log('\nDone.');
}

run().catch(async (err) => {
  console.error('Migration failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
