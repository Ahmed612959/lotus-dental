const { nanoid } = require('nanoid');
const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Appointment = require('../_lib/models/Appointment');
const Doctor = require('../_lib/models/Doctor');
const Service = require('../_lib/models/Service');
const Patient = require('../_lib/models/Patient');
const { getAvailableSlots, timeToMinutes, minutesToTime } = require('../_lib/slotCalculator');

const normalizeDate = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

// GET /api/appointments  -> staff list/filter (auth required)
// POST /api/appointments -> public guest booking
module.exports = withHandler(async (req, res) => {
  if (req.method === 'POST') {
    return createAppointment(req, res);
  }
  if (req.method === 'GET') {
    return listAppointments(req, res);
  }
  return res.status(405).json({ message: 'Method not allowed' });
});

async function createAppointment(req, res) {
  const { doctorId, serviceId, date, startTime, patientName, patientPhone, patientEmail, notes } =
    req.body;

  if (!doctorId || !serviceId || !date || !startTime || !patientName || !patientPhone) {
    return res.status(400).json({ message: 'Missing required booking fields' });
  }

  const [doctor, service] = await Promise.all([Doctor.findById(doctorId), Service.findById(serviceId)]);
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

  const availableSlots = getAvailableSlots({
    doctor,
    date: day,
    durationMinutes: service.durationMinutes,
    existingAppointments,
  });

  if (!availableSlots.includes(startTime)) {
    return res.status(409).json({
      message: 'This slot is no longer available. Please choose another time.',
      availableSlots,
    });
  }

  const endTime = minutesToTime(timeToMinutes(startTime) + service.durationMinutes);

  let patient = await Patient.findOne({ phone: patientPhone.trim() });
  if (!patient) {
    patient = await Patient.create({ name: patientName, phone: patientPhone.trim(), email: patientEmail || '' });
  }

  const bookingCode = nanoid(8).toUpperCase();

  let appointment;
  try {
    appointment = await Appointment.create({
      bookingCode,
      patient: patient._id,
      doctor: doctorId,
      service: serviceId,
      date: day,
      startTime,
      endTime,
      status: 'confirmed',
      bookedVia: 'online',
      notes: notes || '',
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'This slot was just booked by someone else. Please pick another time.' });
    }
    throw err;
  }

  const populated = await appointment.populate([
    { path: 'doctor', select: 'name specialty' },
    { path: 'service', select: 'name durationMinutes' },
    { path: 'patient', select: 'name phone email' },
  ]);

  // NOTE: integrate SMS/WhatsApp/Email notification here (Twilio, etc.)

  res.status(201).json({ message: 'Appointment booked successfully', appointment: populated, bookingCode });
}

async function listAppointments(req, res) {
  const user = await getAuthUser(req);
  requireRole(user, 'admin', 'receptionist', 'doctor');

  const { doctorId, status, from, to, search } = req.query;
  const filter = {};

  if (user.role === 'doctor' && user.doctor) {
    filter.doctor = user.doctor;
  } else if (doctorId) {
    filter.doctor = doctorId;
  }

  if (status) filter.status = status;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = normalizeDate(from);
    if (to) filter.date.$lte = normalizeDate(to);
  }

  let appointments = await Appointment.find(filter)
    .populate('doctor', 'name specialty')
    .populate('service', 'name durationMinutes price')
    .populate('patient', 'name phone email')
    .sort({ date: 1, startTime: 1 });

  if (search) {
    const s = search.toLowerCase();
    appointments = appointments.filter(
      (a) => a.patient?.name?.toLowerCase().includes(s) || a.patient?.phone?.includes(s)
    );
  }

  res.json(appointments);
}
