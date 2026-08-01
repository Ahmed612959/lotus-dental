const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Appointment = require('../_lib/models/Appointment');

// PUT /api/appointments/:id    -> staff update (status/time/notes)
// DELETE /api/appointments/:id -> staff delete
module.exports = withHandler(async (req, res) => {
  const { id } = req.query;
  const user = await getAuthUser(req);

  if (req.method === 'PUT') {
    requireRole(user, 'admin', 'receptionist', 'doctor');
    const appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('doctor', 'name')
      .populate('service', 'name')
      .populate('patient', 'name phone');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    return res.json(appointment);
  }

  if (req.method === 'DELETE') {
    requireRole(user, 'admin', 'receptionist');
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    return res.json({ message: 'Appointment deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
});
