// Read-only scan. Reports what migrate-v2-users and migrate-v2-expenses
// WILL do, plus warnings for risky data (unparseable amounts, unknown
// categories, ambiguous DOBs). Does not write anything.
//
// Run: npm run migrate:v2-preflight

import mongoose from 'mongoose';
import { env } from '../src/shared/config/env.js';

const isLocal = env.MONGO_URL.includes('localhost') || env.MONGO_URL.includes('127.0.0.1');
if (!isLocal && process.env.CONFIRM_PROD !== 'yes') {
  console.error(
    'Refusing to run against non-localhost MONGO_URL. Set CONFIRM_PROD=yes to override.',
  );
  process.exit(1);
}

const VALID_CATEGORIES = new Set([
  'Groceries',
  'Housing & Utilities',
  'Medical',
  'Food',
  'Personal',
  'Educational',
  'Transportation',
  'Miscellaneous',
]);

async function run(): Promise<void> {
  await mongoose.connect(env.MONGO_URL);
  const db = mongoose.connection.db;
  if (!db) throw new Error('No DB connection');
  console.log(`\nConnected to ${db.databaseName}\n`);
  console.log('=== PRE-MIGRATION COUNTS ===\n');

  const counts = {
    users: await db.collection('users').countDocuments(),
    expenses: await db.collection('expenses').countDocuments(),
    deletedusers: await db.collection('deletedusers').countDocuments(),
    pocketmoneys: await db.collection('pocketmoneys').countDocuments(),
    lentmoneys: await db.collection('lentmoneys').countDocuments(),
    activesessions: await db.collection('activesessions').countDocuments(),
  };
  Object.entries(counts).forEach(([k, v]) => console.log(`  ${k.padEnd(15)} ${v}`));

  console.log('\n=== EMBEDDED ARRAYS TO EXTRACT (per user) ===\n');
  let totalPM = 0,
    totalLM = 0,
    totalAS = 0;
  const userCursor = db.collection('users').find({});
  for await (const u of userCursor) {
    const pm = Array.isArray(u.PocketMoneyHistory) ? u.PocketMoneyHistory.length : 0;
    const lm = Array.isArray(u.LentMoneyHistory) ? u.LentMoneyHistory.length : 0;
    const as = Array.isArray(u.activeSessions) ? u.activeSessions.length : 0;
    totalPM += pm;
    totalLM += lm;
    totalAS += as;
    console.log(`  ${(u.email || u._id).toString().padEnd(40)} PM=${pm}, LM=${lm}, AS=${as}`);
  }
  console.log(`\n  Total new pocketmoneys to create:    ${totalPM}`);
  console.log(`  Total new lentmoneys to create:      ${totalLM}`);
  console.log(`  Total new activesessions to create:  ${totalAS}`);

  console.log('\n=== EXPENSE FLATTENING ===\n');
  let totalProducts = 0;
  let oldShapeDocs = 0;
  const distinctCategories = new Set<string>();
  const expCursor = db.collection('expenses').find({ products: { $type: 'array' } });
  for await (const e of expCursor) {
    oldShapeDocs++;
    if (Array.isArray(e.products)) {
      totalProducts += e.products.length;
      for (const p of e.products) if (p?.category) distinctCategories.add(p.category);
    }
  }
  console.log(`  Old-shape day-docs:           ${oldShapeDocs}`);
  console.log(`  Total flat docs to create:    ${totalProducts}`);
  console.log(`  Distinct categories found:    ${[...distinctCategories].join(', ') || '(none)'}`);

  const invalidCats = [...distinctCategories].filter((c) => !VALID_CATEGORIES.has(c));
  if (invalidCats.length > 0) {
    console.warn(`  ⚠  Categories NOT in new enum (will block future edits):`);
    invalidCats.forEach((c) => console.warn(`     - "${c}"`));
  }

  console.log('\n=== UNPARSEABLE AMOUNTS ===\n');
  let badAmounts = 0;
  const cursor2 = db.collection('users').find({});
  for await (const u of cursor2) {
    const checkAmt = (raw: unknown, where: string) => {
      if (raw == null || raw === '') return;
      if (typeof raw === 'number') return;
      const cleaned = String(raw).replace(/[^\d.-]/g, '');
      const n = parseFloat(cleaned);
      if (!Number.isFinite(n) || String(raw).trim() !== String(n)) {
        badAmounts++;
        console.warn(`  ⚠  ${u.email}: ${where} = ${JSON.stringify(raw)} → parses as ${n}`);
      }
    };
    checkAmt(u.currentPocketMoney, 'currentPocketMoney');
    for (const pm of u.PocketMoneyHistory || []) checkAmt(pm.amount, 'PocketMoneyHistory.amount');
    for (const lm of u.LentMoneyHistory || []) checkAmt(lm.price, 'LentMoneyHistory.price');
  }
  if (badAmounts === 0) console.log('  (none)');

  console.log('\n=== AMBIGUOUS 2-DIGIT YEAR DOBs ===\n');
  let ambDob = 0;
  const dobCursor = db.collection('users').find({ dateOfBirth: { $exists: true, $ne: '' } });
  for await (const u of dobCursor) {
    if (typeof u.dateOfBirth !== 'string') continue;
    const m = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{2}|\d{4})$/.exec(u.dateOfBirth);
    if (m && m[3].length === 2) {
      const yy = parseInt(m[3], 10);
      // Windowing: yy<30 → 20yy (2000-2029); yy>=30 → 19yy (1930-1999).
      const guessed = yy < 30 ? 2000 + yy : 1900 + yy;
      console.log(`  ${u.email}: "${u.dateOfBirth}" → ${m[1]}-${m[2]}-${guessed}`);
      ambDob++;
    }
  }
  if (ambDob === 0) console.log('  (none)');

  console.log('\n=== DONE — review warnings above before running migrate:v2-users ===\n');
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Preflight failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
