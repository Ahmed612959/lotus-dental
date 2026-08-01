/**
 * handler.js — shared wrapper for every Vercel serverless function in this project.
 *
 * Vercel functions don't share an Express app, so there's no single place to
 * register global middleware. Instead, every function wraps its logic with
 * `withHandler(fn)`, which:
 *   1. Sets CORS headers (and short-circuits OPTIONS preflight requests)
 *   2. Connects to MongoDB (cached — see dbConnect.js)
 *   3. Catches thrown errors and formats them consistently
 */

const dbConnect = require('./dbConnect');

function setCors(req, res) {
  const allowedOrigin = process.env.CLIENT_URL || '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function withHandler(fn) {
  return async (req, res) => {
    setCors(req, res);

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    try {
      await dbConnect();
      await fn(req, res);
    } catch (err) {
      console.error(err);

      if (err.code === 11000) {
        return res.status(409).json({
          message: 'This slot or record already exists (conflict).',
          field: Object.keys(err.keyValue || {})[0],
        });
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages.join(', ') });
      }
      if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
      }

      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ message: err.message || 'Server error' });
    }
  };
}

module.exports = { withHandler, setCors };
