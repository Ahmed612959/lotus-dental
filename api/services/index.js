const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Service = require('../_lib/models/Service');

// GET  /api/services -> public (active only, or ?all=true for staff)
// POST /api/services -> admin only
module.exports = withHandler(async (req, res) => {
  if (req.method === 'GET') {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    return res.json(services);
  }

  if (req.method === 'POST') {
    const user = await getAuthUser(req);
    requireRole(user, 'admin');
    const service = await Service.create(req.body);
    return res.status(201).json(service);
  }

  return res.status(405).json({ message: 'Method not allowed' });
});
