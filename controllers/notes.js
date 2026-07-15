const router = require('express').Router();

const { Note, User } = require('../models');
const { tokenExtractor } = require('../util/middleware');

// middleware note finder
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);

  if (!req.note) {
    return res.status(404).end();
  }
  next();
};

// get all notes
router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  });
  res.json(notes);
});

// create a new note (requires valid token)
router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);

    if (!user) {
      return res.status(401).json({ error: 'invalid user' });
    }

    const note = await Note.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
    res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// get a single note
router.get('/:id', noteFinder, async (req, res) => {
  res.json(req.note);
});

// delete a note
router.delete('/:id', noteFinder, async (req, res) => {
  await req.note.destroy();
  res.status(204).end();
});

// edit a note
router.put('/:id', noteFinder, async (req, res) => {
  req.note.important = req.body.important;
  await req.note.save();
  res.json(req.note);
});

module.exports = router;
