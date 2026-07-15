const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config');

// sequelize connection
const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// connect + verify the database is reachable
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    const { syncModels } = require('../models');
    await syncModels();
    console.log('connected to the database');
  } catch (err) {
    console.log('failed to connect to the database');
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
