const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Doctor = require('../_lib/models/Doctor');

// GET    /api/doctors/:id -> public
// PUT    /api/doctors/:id -> admin
// DELETE /api/doctors/:id -> admin (soft delete)
module.exports = withHandler(async (req, res) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const doctor = await Doctor.findById(id).populate('services');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    return res.json(doctor);
  }

  if (req.method === 'PUT') {
    const user = await getAuthUser(req);
    requireRole(user, 'admin');
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    return res.json(doctor);
  }

  if (req.method === 'DELETE') {
    const user = await getAuthUser(req);
    requireRole(user, 'admin');
    const doctor = await Doctor.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    return res.json({ message: 'Doctor deactivated', doctor });
  }

  return res.status(405).json({ message: 'Method not allowed' });
});
