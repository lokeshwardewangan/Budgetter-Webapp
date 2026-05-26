// Extract embedded arrays (PocketMoneyHistory, LentMoneyHistory,
// activeSessions) out of User into their own collections. Retype String
// money → Number, dd-mm-yy(yy) → Date. Hashes session tokens via sha256.
//
// IDEMPOTENT — re-running is a no-op:
//   - new-collection inserts use replaceOne({_id}, ..., upsert: true)
//   - User update gates on the embedded arrays still existing
//
// Run: npm run migrate:v2-users

import mongoose from 'mongoose';
import crypto from 'crypto';
import { env } from '../src/shared/config/env.js';

const isLocal = env.MONGO_URL.includes('localhost') || env.MONGO_URL.includes('127.0.0.1');
if (!isLocal && process.env.CONFIRM_PROD !== 'yes') {
  console.error(
    'Refusing to run against non-localhost MONGO_URL. Set CONFIRM_PROD=yes to override.',
  );
  process.exit(1);
}

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

const parseAmount = (v: unknown): number => {
  if (typeof v === 'number') return v;
  if (v == null || v === '') return 0;
  const cleaned = String(v).replace(/[^\d.-]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const parseTransactionDate = (v: unknown): Date | null => {
  if (v == null || v === '') return null;
  if (v instanceof Date) return v;
  const s = String(v);
  const m = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{2}|\d{4})$/.exec(s);
  if (m) {
    const [, dd, mm, yRaw] = m;
    // Transactions are always recent — 2-digit yy → 20yy is safe.
    const yyyy = yRaw.length === 2 ? 2000 + Number(yRaw) : Number(yRaw);
    return new Date(Date.UTC(yyyy, Number(mm) - 1, Number(dd)));
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

const parseDateOfBirth = (v: unknown): Date | null => {
  if (v == null || v === '') return null;
  if (v instanceof Date) return v;
  const m = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{2}|\d{4})$/.exec(String(v));
  if (!m) return null;
  const [, dd, mm, yRaw] = m;
  let yyyy: number;
  if (yRaw.length === 2) {
    const yy = Number(yRaw);
    // Y2K window: yy<30 → 20yy, else 19yy. DOB-specific (transactions use 20yy always).
    yyyy = yy < 30 ? 2000 + yy : 1900 + yy;
  } else {
    yyyy = Number(yRaw);
  }
  return new Date(Date.UTC(yyyy, Number(mm) - 1, Number(dd)));
};

async function run(): Promise<void> {
  await mongoose.connect(env.MONGO_URL);
  const db = mongoose.connection.db;
  if (!db) throw new Error('No DB connection');
  console.log(`Connected to ${db.databaseName}\n`);

  const users = db.collection('users');
  const pocketmoneys = db.collection('pocketmoneys');
  const lentmoneys = db.collection('lentmoneys');
  const activesessions = db.collection('activesessions');
  const deletedusers = db.collection('deletedusers');

  let userProcessed = 0;
  let userSkipped = 0;
  let pmCreated = 0;
  let lmCreated = 0;
  let asCreated = 0;
  let delFixed = 0;

  const cursor = users.find({});
  for await (const u of cursor) {
    const hasEmbedded =
      'PocketMoneyHistory' in u ||
      'LentMoneyHistory' in u ||
      'activeSessions' in u ||
      'dateOfBirth' in u ||
      'accessToken' in u ||
      typeof u.currentPocketMoney === 'string';
    if (!hasEmbedded) {
      userSkipped++;
      continue;
    }

    // Extract PocketMoneyHistory[]
    for (const pm of Array.isArray(u.PocketMoneyHistory) ? u.PocketMoneyHistory : []) {
      const _id = pm._id || new mongoose.Types.ObjectId();
      const date = parseTransactionDate(pm.date);
      if (!date) console.warn(`  ⚠ pocketMoney bad date ${u.email}: ${pm.date}`);
      await pocketmoneys.replaceOne(
        { _id },
        {
          _id,
          user: u._id,
          date: date || new Date(),
          amount: parseAmount(pm.amount),
          source: pm.source || 'Unknown',
          createdAt: pm.createdAt || new Date(),
          updatedAt: pm.updatedAt || new Date(),
        },
        { upsert: true },
      );
      pmCreated++;
    }

    // Extract LentMoneyHistory[]
    for (const lm of Array.isArray(u.LentMoneyHistory) ? u.LentMoneyHistory : []) {
      const _id = lm._id || new mongoose.Types.ObjectId();
      const date = parseTransactionDate(lm.date);
      if (!date) console.warn(`  ⚠ lentMoney bad date ${u.email}: ${lm.date}`);
      await lentmoneys.replaceOne(
        { _id },
        {
          _id,
          user: u._id,
          personName: lm.personName || 'Unknown',
          price: parseAmount(lm.price),
          date: date || new Date(),
          // Old schema had no isReceived/receivedAt — default to unreceived.
          isReceived: false,
          receivedAt: null,
          createdAt: lm.createdAt || new Date(),
          updatedAt: lm.updatedAt || new Date(),
        },
        { upsert: true },
      );
      lmCreated++;
    }

    // Extract activeSessions[] with token → tokenHash.
    for (const s of Array.isArray(u.activeSessions) ? u.activeSessions : []) {
      if (!s.token) {
        console.warn(`  ⚠ session w/o token skipped ${u.email}`);
        continue;
      }
      const _id = s._id || new mongoose.Types.ObjectId();
      await activesessions.replaceOne(
        { _id },
        {
          _id,
          user: u._id,
          tokenHash: sha256(s.token),
          ip: s.ip || 'Unknown',
          userAgent: s.userAgent || 'Unknown',
          lastUsedAt: s.lastUsedAt || new Date(),
          createdAt: s.createdAt || new Date(),
          updatedAt: s.updatedAt || new Date(),
        },
        { upsert: true },
      );
      asCreated++;
    }

    // Update User: set new fields, drop old.
    await users.updateOne(
      { _id: u._id },
      {
        $set: {
          currentPocketMoney: parseAmount(u.currentPocketMoney),
          dob: parseDateOfBirth(u.dateOfBirth),
          role: u.role || 'user',
          passwordResetTokenHash: u.passwordResetTokenHash || null,
        },
        $unset: {
          PocketMoneyHistory: '',
          LentMoneyHistory: '',
          activeSessions: '',
          accessToken: '',
          dateOfBirth: '',
        },
      },
    );

    userProcessed++;
    console.log(
      `  ✓ ${u.email}  PM=${(u.PocketMoneyHistory || []).length} LM=${(u.LentMoneyHistory || []).length} AS=${(u.activeSessions || []).length}`,
    );
  }

  // Fix DeletedUser.currentPocketMoney String → Number.
  const delCursor = deletedusers.find({ currentPocketMoney: { $type: 'string' } });
  for await (const d of delCursor) {
    await deletedusers.updateOne(
      { _id: d._id },
      { $set: { currentPocketMoney: parseAmount(d.currentPocketMoney) } },
    );
    delFixed++;
  }

  console.log('\n=== migrate-v2-users SUMMARY ===');
  console.log(`  Users processed:        ${userProcessed}`);
  console.log(`  Users already migrated: ${userSkipped}`);
  console.log(`  pocketmoneys created:   ${pmCreated}`);
  console.log(`  lentmoneys created:     ${lmCreated}`);
  console.log(`  activesessions created: ${asCreated}`);
  console.log(`  deletedusers retyped:   ${delFixed}`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Migration failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
