const Note = require('./note');
const User = require('./users');

// joins
User.hasMany(Note);
Note.belongsTo(User);

// create table if it doesn't exist
Note.sync({ alter: true });
User.sync({ alter: true });

module.exports = {
  Note,
  User,
};
