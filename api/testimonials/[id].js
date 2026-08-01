const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Testimonial = require('../_lib/models/Testimonial');

// PUT    /api/testimonials/:id -> admin
// DELETE /api/testimonials/:id -> admin
module.exports = withHandler(async (req, res) => {
  const { id } = req.query;
  const user = await getAuthUser(req);
  requireRole(user, 'admin');

  if (req.method === 'PUT') {
    const testimonial = await Testimonial.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    return res.json(testimonial);
  }

  if (req.method === 'DELETE') {
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    return res.json({ message: 'Testimonial deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
});
