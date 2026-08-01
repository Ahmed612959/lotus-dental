const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Doctor = require('../_lib/models/Doctor');

// GET  /api/doctors        -> public (active only, or ?all=true for staff)
// POST /api/doctors        -> admin only
module.exports = withHandler(async (req, res) => {
  if (req.method === 'GET') {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const doctors = await Doctor.find(filter).populate('services').sort({ createdAt: -1 });
    return res.json(doctors);
  }

  if (req.method === 'POST') {
    const user = await getAuthUser(req);
    requireRole(user, 'admin');
    const doctor = await Doctor.create(req.body);
    return res.status(201).json(doctor);
  }

  return res.status(405).json({ message: 'Method not allowed' });
});
