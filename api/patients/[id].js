const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Patient = require('../_lib/models/Patient');
const Appointment = require('../_lib/models/Appointment');

// GET /api/patients/:id -> staff, includes visit history
// PUT /api/patients/:id -> admin/receptionist
module.exports = withHandler(async (req, res) => {
  const { id } = req.query;
  const user = await getAuthUser(req);

  if (req.method === 'GET') {
    requireRole(user, 'admin', 'receptionist', 'doctor');
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const appointments = await Appointment.find({ patient: patient._id })
      .populate('doctor', 'name')
      .populate('service', 'name')
      .sort({ date: -1 });

    return res.json({ patient, appointments });
  }

  if (req.method === 'PUT') {
    requireRole(user, 'admin', 'receptionist');
    const patient = await Patient.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    return res.json(patient);
  }

  return res.status(405).json({ message: 'Method not allowed' });
});
