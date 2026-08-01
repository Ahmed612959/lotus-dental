const mongoose = require('mongoose');

/**
 * dbConnect.js — Serverless-safe MongoDB connection.
 *
 * In a traditional server (Express + app.listen), you connect once when the
 * process starts and it stays connected forever. In Vercel's serverless
 * environment, each function invocation may run in a fresh container, and
 * a busy site can have many concurrent invocations. Opening a brand new
 * MongoDB connection on every single request would be slow and would
 * quickly exhaust MongoDB Atlas's connection limit.
 *
 * The fix: cache the connection (and the in-flight connection promise) on
 * the `global` object, which Vercel reuses across invocations that land on
 * a warm container. If a connection already exists, reuse it instantly.
 */

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 5, // keep the pool small — serverless functions are short-lived
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // allow retry on next invocation instead of caching a failure
    throw err;
  }

  return cached.conn;
}

module.exports = dbConnect;
