// middlewares/checkRole.js
module.exports = function (roles) {
  return (req, res, next) => {
    console.log('Checking roles for user:', req.user);  // This should now include role
    if (!roles.includes(req.user.role)) {
      console.log('Access denied for role:', req.user.role);  // This should log the role
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  };
};
