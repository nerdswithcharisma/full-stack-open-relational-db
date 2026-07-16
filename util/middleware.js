const jwt = require('jsonwebtoken');

const { SECRET } = require('./config');
const { User, Session } = require('../models');

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

// verify JWT + active session; reject disabled users
const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    return res.status(401).json({ error: 'token missing' });
  }

  const token = authorization.substring(7);

  try {
    req.decodedToken = jwt.verify(token, SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'token invalid' });
  }

  const session = await Session.findOne({ where: { token } });
  if (!session) {
    return res.status(401).json({ error: 'session invalid' });
  }

  const user = await User.unscoped().findByPk(req.decodedToken.id);
  if (!user || user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact the administrator',
    });
  }

  req.user = user;
  next();
};

// check if the user is an admin
const isAdmin = async (req, res, next) => {
  const user = await User.unscoped().findByPk(req.decodedToken.id);

  if (!user?.admin) {
    return res.status(401).json({ error: 'operation not allowed' });
  }

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  isAdmin,
};
