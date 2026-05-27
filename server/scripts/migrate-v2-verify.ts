// Post-migration assertions. Exits non-zero if anything is still in the
// old shape. Also recomputes per-user balance from the new collections and
// compares to the cached User.currentPocketMoney.
//
// Run: npm run migrate:v2-verify

import mongoose from 'mongoose';
import { env } from '../src/shared/config/env.js';

async function run(): Promise<void> {
  await mongoose.connect(env.MONGO_URL);
  const db = mongoose.connection.db;
  if (!db) throw new Error('No DB connection');
  console.log(`Verifying ${db.databaseName}...\n`);

  const issues: string[] = [];

  // 1. No User should still have the embedded arrays / legacy fields.
  const dirtyUsers = await db.collection('users').countDocuments({
    $or: [
      { PocketMoneyHistory: { $exists: true } },
      { LentMoneyHistory: { $exists: true } },
      { activeSessions: { $exists: true } },
      { accessToken: { $exists: true } },
      { dateOfBirth: { $exists: true } },
    ],
  });
  if (dirtyUsers > 0)
    issues.push(`${dirtyUsers} User docs still carry embedded arrays / legacy fields`);

  // 2. currentPocketMoney must be Number everywhere.
  const stringPM = await db
    .collection('users')
    .countDocuments({ currentPocketMoney: { $type: 'string' } });
  if (stringPM > 0) issues.push(`${stringPM} User docs still have String currentPocketMoney`);

  const delStringPM = await db
    .collection('deletedusers')
    .countDocuments({ currentPocketMoney: { $type: 'string' } });
  if (delStringPM > 0)
    issues.push(`${delStringPM} DeletedUser docs still have String currentPocketMoney`);

  // 3. No Expense should have a products[] array.
  const dirtyExpenses = await db
    .collection('expenses')
    .countDocuments({ products: { $exists: true } });
  if (dirtyExpenses > 0) issues.push(`${dirtyExpenses} Expense docs still have products[] array`);

  // 4. All ActiveSession docs should have tokenHash, none should have raw token.
  const tokenSessions = await db
    .collection('activesessions')
    .countDocuments({ token: { $exists: true } });
  if (tokenSessions > 0) issues.push(`${tokenSessions} ActiveSession docs still have token field`);

  const sessionsNoHash = await db
    .collection('activesessions')
    .countDocuments({ tokenHash: { $exists: false } });
  if (sessionsNoHash > 0) issues.push(`${sessionsNoHash} ActiveSession docs are missing tokenHash`);

  // 5. Every Expense.category must be in the new enum (else editing it will 400).
  const VALID_CATEGORIES = [
    'Groceries',
    'Housing & Utilities',
    'Medical',
    'Food',
    'Personal',
    'Educational',
    'Transportation',
    'Miscellaneous',
  ];
  const badCatExpenses = await db
    .collection('expenses')
    .countDocuments({ category: { $nin: VALID_CATEGORIES } });
  if (badCatExpenses > 0)
    issues.push(`${badCatExpenses} Expense docs have a category not in the new enum`);

  console.log('=== POST-MIGRATION COUNTS ===\n');
  console.log(`  users:           ${await db.collection('users').countDocuments()}`);
  console.log(`  pocketmoneys:    ${await db.collection('pocketmoneys').countDocuments()}`);
  console.log(`  lentmoneys:      ${await db.collection('lentmoneys').countDocuments()}`);
  console.log(`  activesessions:  ${await db.collection('activesessions').countDocuments()}`);
  console.log(`  expenses:        ${await db.collection('expenses').countDocuments()}`);
  console.log(`  deletedusers:    ${await db.collection('deletedusers').countDocuments()}`);

  console.log('\n=== BALANCE INVARIANT (per user) ===\n');
  // Per-user: sum(pocketMoney) - sum(expense) - sum(unreceived lentMoney) == currentPocketMoney
  const userCursor = db.collection('users').find({});
  let balanceMismatches = 0;
  for await (const u of userCursor) {
    const pmAgg = await db
      .collection('pocketmoneys')
      .aggregate([
        { $match: { user: u._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .toArray();
    const expAgg = await db
      .collection('expenses')
      .aggregate([
        { $match: { user: u._id } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ])
      .toArray();
    const lentAgg = await db
      .collection('lentmoneys')
      .aggregate([
        { $match: { user: u._id, isReceived: false } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ])
      .toArray();

    const computed = (pmAgg[0]?.total || 0) - (expAgg[0]?.total || 0) - (lentAgg[0]?.total || 0);
    const stored = u.currentPocketMoney;
    const diff = stored - computed;
    const ok = Math.abs(diff) < 0.01;
    if (!ok) balanceMismatches++;
    console.log(
      `  ${ok ? '✓' : '⚠'} ${(u.email || u._id).toString().padEnd(40)} stored=${stored}, computed=${computed}, diff=${diff.toFixed(2)}`,
    );
  }

  console.log('');
  if (issues.length > 0) {
    console.error('❌ VERIFICATION FAILED:\n');
    issues.forEach((i) => console.error(`  - ${i}`));
    process.exit(1);
  } else if (balanceMismatches > 0) {
    console.warn(
      `⚠ VERIFICATION PASSED but ${balanceMismatches} user(s) have balance drift (informational).`,
    );
  } else {
    console.log('✅ VERIFICATION PASSED — all docs in new shape, balances consistent.');
  }

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Verify failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
