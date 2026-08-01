const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Service = require('../_lib/models/Service');

// GET    /api/services/:id -> public
// PUT    /api/services/:id -> admin
// DELETE /api/services/:id -> admin (soft delete)
module.exports = withHandler(async (req, res) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    return res.json(service);
  }

  if (req.method === 'PUT') {
    const user = await getAuthUser(req);
    requireRole(user, 'admin');
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    return res.json(service);
  }

  if (req.method === 'DELETE') {
    const user = await getAuthUser(req);
    requireRole(user, 'admin');
    const service = await Service.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    return res.json({ message: 'Service deactivated', service });
  }

  return res.status(405).json({ message: 'Method not allowed' });
});
