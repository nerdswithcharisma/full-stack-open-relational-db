const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const notesRouter = require('./controllers/notes');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

// parse JSON bodies
app.use(express.json());

// mount routes
app.use('/api/notes', notesRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

const start = async () => {
  await connectToDatabase();
  // start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
