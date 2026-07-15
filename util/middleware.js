const jwt = require('jsonwebtoken');

const { SECRET } = require('./config');
const { User } = require('../models');

// centralized error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return response.status(400).json({
      error: error.errors.map((e) => e.message),
    });
  }

  return response.status(400).json({ error: [error.message] });
};

// verify JWT from Authorization header
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }

  next();
};

// check if the user is an admin
const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' });
  }

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  isAdmin,
};
