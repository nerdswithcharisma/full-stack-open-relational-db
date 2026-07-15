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

const syncModels = async () => {
  await User.sync({ alter: true });
  await Note.sync({ alter: true });
  await Blog.sync({ alter: true });
};

module.exports = {
  Note,
  Blog,
  User,
  syncModels,
};
