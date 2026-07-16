const router = require('express').Router();

const { Blog, User, ReadingList } = require('../models');
const { tokenExtractor } = require('../util/middleware');

// add a blog to a user's reading list
router.post('/', async (req, res) => {
  const { blogId, userId } = req.body;

  if (userId === undefined) {
    return res.status(400).json({ error: 'userId is required' });
  }

  if (blogId === undefined) {
    return res.status(400).json({ error: 'blogId is required' });
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ error: 'userId is not valid' });
  }

  const blog = await Blog.findByPk(blogId);
  if (!blog) {
    return res.status(404).json({ error: 'blogId is not valid' });
  }

  const existing = await ReadingList.findOne({ where: { userId, blogId } });
  if (existing) {
    return res.status(400).json({ error: 'blog already in reading list' });
  }

  const readingList = await ReadingList.create({
    userId,
    blogId,
  });

  res.json({
    id: readingList.id,
    user_id: readingList.userId,
    blog_id: readingList.blogId,
    read: readingList.read,
  });
});

// mark a reading list entry as read / unread
router.put('/:id', tokenExtractor, async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id);
  if (!readingList) {
    return res.status(404).json({ error: 'readingList is not valid' });
  }

  if (readingList.userId !== req.decodedToken.id) {
    return res.status(401).json({ error: 'operation not allowed' });
  }

  readingList.read = req.body.read;
  await readingList.save();

  res.json(readingList);
});

module.exports = router;
