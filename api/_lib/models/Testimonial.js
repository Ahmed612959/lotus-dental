const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    text: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    photo: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', TestimonialSchema);
