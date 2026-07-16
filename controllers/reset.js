const router = require('express').Router();

const { sequelize } = require('../util/db');

// empty all app tables (for tests)
router.post('/', async (req, res) => {
  await sequelize.query(`
    TRUNCATE TABLE
      sessions,
      reading_lists,
      user_notes,
      memberships,
      notes,
      blogs,
      teams,
      users
    RESTART IDENTITY CASCADE
  `);

  res.status(204).end();
});

module.exports = router;
