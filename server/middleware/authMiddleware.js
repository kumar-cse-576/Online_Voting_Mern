const jwt = require('jsonwebtoken');

// Middleware to verify token and attach user data
function protectRoute(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains user id and role
    next(); // Proceed
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Middleware to allow only admin
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
}

// ✅ Export both middlewares
module.exports = { protectRoute, adminOnly };
