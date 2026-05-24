// Hashes existing session.token (plaintext JWT) into session.tokenHash.
// Idempotent: skips docs already migrated.

import mongoose from 'mongoose';
import crypto from 'crypto';
import { env } from '../src/shared/config/env.js';

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

async function run() {
  await mongoose.connect(env.MONGO_URL);
  const db = mongoose.connection.db;
  const coll = db.collection('activesessions');
  console.log(`Connected to ${db.databaseName}\n`);

  const cursor = coll.find({ token: { $exists: true } });
  let scanned = 0;
  const ops = [];

  for await (const doc of cursor) {
    scanned++;
    ops.push({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: { tokenHash: sha256(doc.token) }, $unset: { token: '' } },
      },
    });
  }

  if (ops.length) await coll.bulkWrite(ops, { ordered: false });

  console.log(`scanned ${scanned}, updated ${ops.length}`);
  await mongoose.disconnect();
  console.log('\nDone.');
}

run().catch(async (err) => {
  console.error('Migration failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
