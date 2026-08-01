const { nanoid } = require('nanoid');
const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Doctor = require('../_lib/models/Doctor');
const Service = require('../_lib/models/Service');
const Patient = require('../_lib/models/Patient');
const Appointment = require('../_lib/models/Appointment');
const { timeToMinutes, minutesToTime } = require('../_lib/slotCalculator');

const normalizeDate = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

// POST /api/appointments/manual  (staff - book on behalf of a walk-in/phone patient)
module.exports = withHandler(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const user = await getAuthUser(req);
  requireRole(user, 'admin', 'receptionist');

  const { doctorId, serviceId, date, startTime, patientName, patientPhone, patientEmail, notes, status } =
    req.body;

  const [doctor, service] = await Promise.all([Doctor.findById(doctorId), Service.findById(serviceId)]);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  if (!service) return res.status(404).json({ message: 'Service not found' });

  const day = normalizeDate(date);
  const endTime = minutesToTime(timeToMinutes(startTime) + service.durationMinutes);

  let patient = await Patient.findOne({ phone: patientPhone.trim() });
  if (!patient) {
    patient = await Patient.create({ name: patientName, phone: patientPhone.trim(), email: patientEmail || '' });
  }

  try {
    const appointment = await Appointment.create({
      bookingCode: nanoid(8).toUpperCase(),
      patient: patient._id,
      doctor: doctorId,
      service: serviceId,
      date: day,
      startTime,
      endTime,
      status: status || 'confirmed',
      bookedVia: 'reception',
      notes: notes || '',
    });
    res.status(201).json(appointment);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'This doctor already has an appointment at this exact time.' });
    }
    throw err;
  }
});
