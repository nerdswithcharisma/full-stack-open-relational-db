const router = require('express').Router();

const { Blog, User, ReadingList } = require('../models');

// add a blog to a user's reading list
router.post('/', async (req, res) => {
  const { blogId, userId } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(400).json({ error: 'userId is not valid' });
  }

  const blog = await Blog.findByPk(blogId);
  if (!blog) {
    return res.status(400).json({ error: 'blogId is not valid' });
  }

  const readingList = await ReadingList.create({
    userId,
    blogId,
  });

  res.json(readingList);
});

// mark blogs as read
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;

  const readingList = await ReadingList.findByPk(id);
  if (!readingList) {
    return res.status(400).json({ error: 'readingList is not valid' });
  }

  readingList.read = read;
  await readingList.save();

  res.json(readingList);
});

module.exports = router;
