const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');
const { errorHandler } = require('./util/middleware');

const notesRouter = require('./controllers/notes');
const blogsRouter = require('./controllers/blogs');
const authorsRouter = require('./controllers/authors');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const readinglistsRouter = require('./controllers/readinglists');
const resetRouter = require('./controllers/reset');

// parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.sendStatus(200);
});

// mount routes
app.use('/api/notes', notesRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/readinglists', readinglistsRouter);
app.use('/api/reset', resetRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  // start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
