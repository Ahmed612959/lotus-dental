const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const User = require('../_lib/models/User');

// POST /api/auth/register (admin-only)
module.exports = withHandler(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const currentUser = await getAuthUser(req);
  requireRole(currentUser, 'admin');

  const { name, email, password, role, doctor } = req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: 'Email already in use' });
  }
  const user = await User.create({ name, email, password, role, doctor });
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
