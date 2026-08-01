const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Patient = require('../_lib/models/Patient');

// GET /api/patients?search=  (staff)
module.exports = withHandler(async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const user = await getAuthUser(req);
  requireRole(user, 'admin', 'receptionist');

  const { search } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }
  const patients = await Patient.find(filter).sort({ createdAt: -1 });
  res.json(patients);
});
