const Note = require('./note');

// create table if it doesn't exist
Note.sync();

module.exports = {
  Note,
};
