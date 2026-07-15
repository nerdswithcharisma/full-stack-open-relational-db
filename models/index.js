const Note = require('./note');
const Blog = require('./blog');
const User = require('./users');

// joins
User.hasMany(Note);
Note.belongsTo(User);

User.hasMany(Blog);
Blog.belongsTo(User, {
  foreignKey: {
    allowNull: false,
  },
});

// create table if it doesn't exist
Note.sync({ alter: true });
Blog.sync({ alter: true });
User.sync({ alter: true });

module.exports = {
  Note,
  Blog,
  User,
};
