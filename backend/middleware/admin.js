const admin = (req, res, next) => {
    if (!req.isAdmin) {
      return res.status(403).send('Access denied. Admins only.');
    }
    next();
  };
  
  module.exports = admin;
  