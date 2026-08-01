const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    // Public code used by patients to view/cancel/edit their booking without login
    bookingCode: { type: String, required: true, unique: true, index: true },

    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },

    date: { type: Date, required: true }, // the day of appointment (normalized to midnight)
    startTime: { type: String, required: true }, // "10:30"
    endTime: { type: String, required: true }, // computed from service duration

    // 'confirmed' = booked directly online into an open slot
    // 'pending'   = needs reception review (e.g. requested outside normal slot logic)
    // 'cancelled' = cancelled by patient or staff
    // 'completed' = visit happened
    // 'no_show'   = patient did not show up
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'confirmed',
    },

    bookedVia: { type: String, enum: ['online', 'reception'], default: 'online' },
    notes: { type: String, default: '' },

    // Internal staff notes about the visit (not shown to patient)
    internalNotes: { type: String, default: '' },

    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent double-booking at the schema level: no two non-cancelled appointments
// for the same doctor can share the same date + startTime
AppointmentSchema.index(
  { doctor: 1, date: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } },
  }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
