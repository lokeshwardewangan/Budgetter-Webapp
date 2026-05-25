// One-shot migration: convert legacy String money + String dd-mm-yyyy (or dd-mm-yy)
// date fields to Number + Date. Run with `npm run migrate:v2-types`.
//
// Idempotent: skips docs already in the new shape. Reads via raw collection
// driver to bypass the Mongoose schema (which now expects Number/Date and
// would reject reads of the old String values).

import mongoose from 'mongoose';
import type { Db, AnyBulkWriteOperation } from 'mongodb';
import { env } from '../src/shared/config/env.js';

const parseDdMmYyyy = (s: unknown): Date | null => {
  if (s == null || s === '') return null;
  if (s instanceof Date) return s;
  const m = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{2}|\d{4})$/.exec(String(s));
  if (!m) return null;
  const [, dd, mm, yRaw] = m;
  const yyyy = yRaw.length === 2 ? 2000 + Number(yRaw) : Number(yRaw);
  return new Date(Date.UTC(yyyy, Number(mm) - 1, Number(dd)));
};

const toNumber = (v: unknown): number => {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
};

interface MigrationResult {
  scanned: number;
  updated: number;
}

async function migrateUsers(db: Db): Promise<MigrationResult> {
  const coll = db.collection('users');
  const cursor = coll.find({});
  let scanned = 0;
  let updated = 0;
  const ops: AnyBulkWriteOperation[] = [];

  for await (const doc of cursor) {
    scanned++;
    const set: Record<string, unknown> = {};
    const unset: Record<string, unknown> = {};

    if (typeof doc.currentPocketMoney === 'string')
      set.currentPocketMoney = toNumber(doc.currentPocketMoney);
    if (doc.dateOfBirth !== undefined) {
      set.dob = parseDdMmYyyy(doc.dateOfBirth);
      unset.dateOfBirth = '';
    }

    if (Object.keys(set).length || Object.keys(unset).length) {
      const update: Record<string, unknown> = {};
      if (Object.keys(set).length) update.$set = set;
      if (Object.keys(unset).length) update.$unset = unset;
      ops.push({ updateOne: { filter: { _id: doc._id }, update } });
      updated++;
    }
  }
  if (ops.length) await coll.bulkWrite(ops, { ordered: false });
  return { scanned, updated };
}

async function migrateMoneyDateCollection(
  db: Db,
  name: string,
  moneyField: string,
): Promise<MigrationResult> {
  const coll = db.collection(name);
  const cursor = coll.find({});
  let scanned = 0;
  let updated = 0;
  const ops: AnyBulkWriteOperation[] = [];

  for await (const doc of cursor) {
    scanned++;
    const set: Record<string, unknown> = {};
    if (typeof doc[moneyField] === 'string') set[moneyField] = toNumber(doc[moneyField]);
    if (typeof doc.date === 'string') {
      const parsed = parseDdMmYyyy(doc.date);
      if (parsed) set.date = parsed;
    }
    if (Object.keys(set).length) {
      ops.push({ updateOne: { filter: { _id: doc._id }, update: { $set: set } } });
      updated++;
    }
  }
  if (ops.length) await coll.bulkWrite(ops, { ordered: false });
  return { scanned, updated };
}

async function migrateExpenses(db: Db): Promise<MigrationResult> {
  const coll = db.collection('expenses');
  const cursor = coll.find({});
  let scanned = 0;
  let updated = 0;
  const ops: AnyBulkWriteOperation[] = [];

  for await (const doc of cursor) {
    scanned++;
    if (typeof doc.date === 'string') {
      const parsed = parseDdMmYyyy(doc.date);
      if (parsed) {
        ops.push({ updateOne: { filter: { _id: doc._id }, update: { $set: { date: parsed } } } });
        updated++;
      }
    }
  }
  if (ops.length) await coll.bulkWrite(ops, { ordered: false });
  return { scanned, updated };
}

async function migrateDeletedUsers(db: Db): Promise<MigrationResult> {
  const coll = db.collection('deletedusers');
  const cursor = coll.find({ currentPocketMoney: { $type: 'string' } });
  let scanned = 0;
  let updated = 0;
  const ops: AnyBulkWriteOperation[] = [];

  for await (const doc of cursor) {
    scanned++;
    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { currentPocketMoney: toNumber(doc.currentPocketMoney) } },
      },
    });
    updated++;
  }
  if (ops.length) await coll.bulkWrite(ops, { ordered: false });
  return { scanned, updated };
}

async function main(): Promise<void> {
  await mongoose.connect(env.MONGO_URL);
  const db = mongoose.connection.db as Db;
  console.log(`Connected to ${db.databaseName}\n`);

  const users = await migrateUsers(db);
  console.log(`users           — scanned ${users.scanned}, updated ${users.updated}`);

  const pocket = await migrateMoneyDateCollection(db, 'pocketmoneys', 'amount');
  console.log(`pocketmoneys    — scanned ${pocket.scanned}, updated ${pocket.updated}`);

  const lent = await migrateMoneyDateCollection(db, 'lentmoneys', 'price');
  console.log(`lentmoneys      — scanned ${lent.scanned}, updated ${lent.updated}`);

  const expenses = await migrateExpenses(db);
  console.log(`expenses        — scanned ${expenses.scanned}, updated ${expenses.updated}`);

  const deletedUsers = await migrateDeletedUsers(db);
  console.log(`deletedusers    — scanned ${deletedUsers.scanned}, updated ${deletedUsers.updated}`);

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(async (err) => {
  console.error('Migration failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
