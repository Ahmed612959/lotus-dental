const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    // Singleton document - there should only ever be one
    clinicName: {
      ar: { type: String, default: 'عيادة لوتس لطب الأسنان' },
      en: { type: String, default: 'Lotus Dental Care' },
    },
    phone: [{ type: String }],
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    address: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    mapEmbedUrl: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    // Clinic-wide default working hours (used as fallback/reference)
    workingHours: [
      {
        day: {
          type: String,
          enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        },
        startTime: String,
        endTime: String,
        isClosed: { type: Boolean, default: false },
      },
    ],
    // Public holidays / clinic-wide closed dates (blocks booking clinic-wide)
    closedDates: [
      {
        date: Date,
        reason: { ar: String, en: String },
      },
    ],
    aboutUs: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    heroImage: { type: String, default: '' },
    stats: {
      patients: { type: Number, default: 0 },
      yearsExperience: { type: Number, default: 0 },
      doctorsCount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', SettingsSchema);
