const jwt = require('jsonwebtoken');
const User = require('./models/User');

/**
 * getAuthUser — verifies the Bearer token on a request and returns the user.
 * Throws a 401 error (with statusCode set) if missing/invalid.
 * Used inside handlers instead of Express middleware, since serverless
 * functions don't have a shared middleware chain.
 */
async function getAuthUser(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    const err = new Error('Not authorized, no token provided');
    err.statusCode = 401;
    throw err;
  }
  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    const err = new Error('Not authorized, invalid token');
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isActive) {
    const err = new Error('Not authorized, user not found or inactive');
    err.statusCode = 401;
    throw err;
  }
  return user;
}

/** requireRole — throws a 403 error if the user's role isn't in the allowed list */
function requireRole(user, ...roles) {
  if (!roles.includes(user.role)) {
    const err = new Error('Forbidden: insufficient permissions');
    err.statusCode = 403;
    throw err;
  }
}

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = { getAuthUser, requireRole, generateToken };
