const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const notesRouter = require('./controllers/notes');

// parse JSON bodies
app.use(express.json());

// mount notes routes
app.use('/api/notes', notesRouter);

const start = async () => {
  await connectToDatabase();
  // start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
