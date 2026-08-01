const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Appointment = require('../_lib/models/Appointment');
const Patient = require('../_lib/models/Patient');

const normalizeDate = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

// GET /api/appointments/stats
module.exports = withHandler(async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const user = await getAuthUser(req);
  requireRole(user, 'admin', 'receptionist');

  const today = normalizeDate(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const [todayCount, weekCount, pendingCount, totalPatients] = await Promise.all([
    Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow }, status: { $in: ['confirmed', 'pending'] } }),
    Appointment.countDocuments({ date: { $gte: weekStart, $lt: weekEnd }, status: { $in: ['confirmed', 'pending'] } }),
    Appointment.countDocuments({ status: 'pending' }),
    Patient.countDocuments(),
  ]);

  res.json({ todayCount, weekCount, pendingCount, totalPatients });
});
