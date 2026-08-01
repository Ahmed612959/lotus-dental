const { withHandler } = require('../../_lib/handler');
const Appointment = require('../../_lib/models/Appointment');

// GET /api/appointments/lookup/:bookingCode
module.exports = withHandler(async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const { bookingCode } = req.query;
  const appointment = await Appointment.findOne({ bookingCode })
    .populate('doctor', 'name specialty photo')
    .populate('service', 'name durationMinutes')
    .populate('patient', 'name phone');

  if (!appointment) return res.status(404).json({ message: 'Booking not found' });
  res.json(appointment);
});
