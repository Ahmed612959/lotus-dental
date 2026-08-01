const { withHandler } = require('../_lib/handler');
const { getAuthUser, requireRole } = require('../_lib/auth');
const Settings = require('../_lib/models/Settings');

// GET /api/settings -> public
// PUT /api/settings -> admin only
module.exports = withHandler(async (req, res) => {
  if (req.method === 'GET') {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    return res.json(settings);
  }

  if (req.method === 'PUT') {
    const user = await getAuthUser(req);
    requireRole(user, 'admin');

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    return res.json(settings);
  }

  return res.status(405).json({ message: 'Method not allowed' });
});
