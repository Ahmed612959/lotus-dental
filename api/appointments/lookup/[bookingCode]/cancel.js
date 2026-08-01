const { withHandler } = require('../../../_lib/handler');
const Appointment = require('../../../_lib/models/Appointment');

// PUT /api/appointments/lookup/:bookingCode/cancel
module.exports = withHandler(async (req, res) => {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  const { bookingCode } = req.query;
  const appointment = await Appointment.findOne({ bookingCode });
  if (!appointment) return res.status(404).json({ message: 'Booking not found' });

  appointment.status = 'cancelled';
  await appointment.save();
  res.json({ message: 'Appointment cancelled', appointment });
});
