// Flatten old per-day Expense docs (with embedded products[]) into one
// doc per product line. Parses String dd-mm-yy(yy) → Date. Reuses each
// product._id as the new doc _id.
//
// IDEMPOTENT — re-running is a no-op:
//   - product upserts use replaceOne({_id}, ..., upsert: true)
//   - day-doc deletion happens AFTER its products are safely upserted
//   - re-run finds zero old-shape docs (since they were deleted)
//
// Run: npm run migrate:v2-expenses

import mongoose from 'mongoose';
import { env } from '../src/shared/config/env.js';

const isLocal = env.MONGO_URL.includes('localhost') || env.MONGO_URL.includes('127.0.0.1');
if (!isLocal && process.env.CONFIRM_PROD !== 'yes') {
  console.error(
    'Refusing to run against non-localhost MONGO_URL. Set CONFIRM_PROD=yes to override.',
  );
  process.exit(1);
}

// Legacy categories observed in old data → canonical new-enum values.
// Anything not in this map AND not already in the new enum is left as-is
// (and will be reported by migrate-v2-verify).
const CATEGORY_REMAP: Record<string, string> = {
  Utilities: 'Housing & Utilities',
  Housing: 'Housing & Utilities',
  Household: 'Miscellaneous',
  Travel: 'Transportation',
  'Personal Care': 'Personal',
};

const normalizeCategory = (c: unknown): string => {
  if (typeof c !== 'string') return 'Miscellaneous';
  return CATEGORY_REMAP[c] ?? c;
};

const parseDate = (v: unknown): Date => {
  if (v instanceof Date) return v;
  if (typeof v === 'string') {
    const m = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{2}|\d{4})$/.exec(v);
    if (m) {
      const [, dd, mm, yRaw] = m;
      const yyyy = yRaw.length === 2 ? 2000 + Number(yRaw) : Number(yRaw);
      return new Date(Date.UTC(yyyy, Number(mm) - 1, Number(dd)));
    }
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
};

async function run(): Promise<void> {
  await mongoose.connect(env.MONGO_URL);
  const db = mongoose.connection.db;
  if (!db) throw new Error('No DB connection');
  const coll = db.collection('expenses');
  console.log(`Connected to ${db.databaseName}\n`);

  let dayDocsScanned = 0;
  let dayDocsDeleted = 0;
  let flatUpserted = 0;
  let emptyDayDocsDeleted = 0;

  const cursor = coll.find({ products: { $type: 'array' } });
  for await (const doc of cursor) {
    dayDocsScanned++;

    if (!Array.isArray(doc.products) || doc.products.length === 0) {
      // Day-doc with no products → just remove the husk.
      await coll.deleteOne({ _id: doc._id });
      emptyDayDocsDeleted++;
      continue;
    }

    const parsedDate = parseDate(doc.date);

    // Upsert each product as a flat doc. Crash here = safe; re-run skips
    // already-upserted ones because replaceOne by _id is idempotent.
    for (const p of doc.products) {
      const productId = p._id || new mongoose.Types.ObjectId();
      await coll.replaceOne(
        { _id: productId },
        {
          _id: productId,
          user: doc.user,
          date: parsedDate,
          name: p.name,
          price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
          category: normalizeCategory(p.category),
          label: p.label ?? null,
          createdAt: p.createdAt || doc.createdAt || new Date(),
          updatedAt: p.updatedAt || doc.updatedAt || new Date(),
        },
        { upsert: true },
      );
      flatUpserted++;
    }

    // All products safely inserted — drop the day doc.
    await coll.deleteOne({ _id: doc._id });
    dayDocsDeleted++;
  }

  console.log('\n=== migrate-v2-expenses SUMMARY ===');
  console.log(`  Day-docs scanned:           ${dayDocsScanned}`);
  console.log(`  Day-docs deleted (had products): ${dayDocsDeleted}`);
  console.log(`  Day-docs deleted (empty):   ${emptyDayDocsDeleted}`);
  console.log(`  Flat expense docs upserted: ${flatUpserted}`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Migration failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
