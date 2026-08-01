const mongoose = require('mongoose');

// Weekly working hours, e.g. { day: 'sunday', startTime: '10:00', endTime: '18:00' }
const WorkingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      required: true,
    },
    startTime: { type: String, required: true }, // "10:00"
    endTime: { type: String, required: true }, // "18:00"
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const DoctorSchema = new mongoose.Schema(
  {
    name: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    specialty: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    bio: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    qualifications: [
      {
        ar: String,
        en: String,
      },
    ],
    yearsOfExperience: { type: Number, default: 0 },
    photo: { type: String, default: '' }, // URL/path to image
    workingHours: [WorkingHourSchema],
    // Dates the doctor is off in addition to weekly schedule (vacation, etc.)
    daysOff: [{ type: Date }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', DoctorSchema);
