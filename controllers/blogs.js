const router = require('express').Router();
const { Op } = require('sequelize');

const { Blog, User } = require('../models');
const { tokenExtractor } = require('../util/middleware');

// get all blogs
router.get('/', async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username'],
    },
    where,
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

// get blog by id
router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id, {
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username'],
    },
  });

  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

// create a new blog (requires valid token)
router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (!user) {
    return res.status(401).json({ error: 'invalid user' });
  }

  const { userId, user_id, ...blogData } = req.body;

  const blog = await Blog.create({
    ...blogData,
    userId: user.id,
  });

  res.json(blog);
});

// delete a blog post
router.delete('/:id', tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  const user = await User.findByPk(req.decodedToken.id);

  if (!user || blog.userId !== user.id) {
    return res.status(401).json({ error: 'invalid user' });
  }

  if (blog) {
    await blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

// edit a blog post (likes)
router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (blog) {
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
