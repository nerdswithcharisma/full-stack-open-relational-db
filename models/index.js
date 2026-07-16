const Note = require('./note');
const Blog = require('./blog');
const User = require('./users');
const Team = require('./team');
const Membership = require('./membership');
const UserNotes = require('./userNote');
const ReadingList = require('./readingList');
const Session = require('./session');

// joins
User.hasMany(Note);
Note.belongsTo(User);

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Team, { through: Membership });
Team.belongsToMany(User, { through: Membership });

User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' });
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' });

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList, as: 'users_reading' });

User.hasMany(Session);
Session.belongsTo(User);

module.exports = {
  Note,
  Blog,
  User,
  Team,
  Membership,
  UserNotes,
  ReadingList,
  Session,
};
