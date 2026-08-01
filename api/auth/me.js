const { withHandler } = require('../_lib/handler');
const { getAuthUser } = require('../_lib/auth');

// GET /api/auth/me
module.exports = withHandler(async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const user = await getAuthUser(req);
  res.json({ user });
});
