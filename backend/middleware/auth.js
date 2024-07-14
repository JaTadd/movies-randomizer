const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).send('Access denied. No token provided.');
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).send('Access denied. Invalid token format.');
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin; // Ajout de la vérification si l'utilisateur est admin
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

module.exports = auth;
