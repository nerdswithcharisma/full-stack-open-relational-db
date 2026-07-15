const router = require('express').Router();

const { Note, Blog, User } = require('../models');
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
        model: Blog,
        attributes: { exclude: ['userId'] },
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
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
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
