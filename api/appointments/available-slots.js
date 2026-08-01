const { withHandler } = require('../_lib/handler');
const Doctor = require('../_lib/models/Doctor');
const Service = require('../_lib/models/Service');
const Appointment = require('../_lib/models/Appointment');
const Settings = require('../_lib/models/Settings');
const { getAvailableSlots } = require('../_lib/slotCalculator');

const normalizeDate = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

// GET /api/appointments/available-slots?doctorId=&serviceId=&date=YYYY-MM-DD
module.exports = withHandler(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { doctorId, serviceId, date } = req.query;
  if (!doctorId || !serviceId || !date) {
    return res
      .status(400)
      .json({ message: 'doctorId, serviceId, and date are required query params' });
  }

  const [doctor, service, settings] = await Promise.all([
    Doctor.findById(doctorId),
    Service.findById(serviceId),
    Settings.findOne(),
  ]);

  if (!doctor || !doctor.isActive) return res.status(404).json({ message: 'Doctor not found' });
  if (!service || !service.isActive) return res.status(404).json({ message: 'Service not found' });

  const day = normalizeDate(date);
  const nextDay = new Date(day);
  nextDay.setDate(nextDay.getDate() + 1);

  const existingAppointments = await Appointment.find({
    doctor: doctorId,
    date: { $gte: day, $lt: nextDay },
    status: { $in: ['pending', 'confirmed'] },
  }).select('startTime endTime');

  const slots = getAvailableSlots({
    doctor,
    date: day,
    durationMinutes: service.durationMinutes,
    existingAppointments,
    clinicClosedDates: (settings && settings.closedDates.map((c) => c.date)) || [],
  });

  res.json({ date, slots });
});
