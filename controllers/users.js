const router = require('express').Router();

const { Note, Blog, User, Team } = require('../models');
const { tokenExtractor, isAdmin } = require('../util/middleware');

// get all users
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: [],
        },
        include: {
          model: User,
          attributes: ['name'],
        },
      },
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: [],
        },
      },
    ],
  });
  res.json(users);
});

// create a new user
router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// get a user by id
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: [],
        },
        include: {
          model: User,
          attributes: ['name'],
        },
      },
      {
        model: Team,
        attributes: ['name', 'id'],
        through: {
          attributes: [],
        },
      },
    ],
  });
  if (user) {
    const userJson = user.toJSON();
    userJson.note_count = userJson.notes.length;
    delete userJson.notes;
    res.json(userJson);
  } else {
    res.status(404).end();
  }
});

// update a user
// router.put('/:id', async (req, res) => {
//   const user = await User.findByPk(req.params.id);

//   if (user) {
//     user.username = req.body.username;
//     await user.save();
//     res.json(user);
//   } else {
//     res.status(404).end();
//   }
// });

// admin route to disable users
router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (user) {
    user.disabled = req.body.disabled;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
