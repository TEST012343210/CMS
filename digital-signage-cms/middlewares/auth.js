// middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    console.log('Authenticated user:', req.user);  // This should now include role
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
