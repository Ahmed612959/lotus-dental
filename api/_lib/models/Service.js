const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      ar: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    icon: { type: String, default: 'tooth' }, // icon key used by frontend
    image: { type: String, default: '' },
    price: { type: Number, default: 0 }, // 0 = "على حسب الكشف" / price on consultation
    showPrice: { type: Boolean, default: true },
    durationMinutes: { type: Number, required: true, default: 30 }, // used for slot calculation
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }, // for display ordering
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);
