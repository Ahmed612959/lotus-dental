const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Testimonial = require('../_lib/models/Testimonial');

// GET  /api/testimonials -> public (published only, or ?all=true for staff)
// POST /api/testimonials -> admin only
module.exports = withHandler(async (req, res) => {
  if (req.method === 'GET') {
    const filter = req.query.all === 'true' ? {} : { isPublished: true };
    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    return res.json(testimonials);
  }

  if (req.method === 'POST') {
    const user = await getAuthUser(req);
    requireRole(user, 'admin');
    const testimonial = await Testimonial.create(req.body);
    return res.status(201).json(testimonial);
  }

  return res.status(405).json({ message: 'Method not allowed' });
});
