const { withHandler } = require('./_lib/handler');

// GET /api/health
module.exports = withHandler(async (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});
