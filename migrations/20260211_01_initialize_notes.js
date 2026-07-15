const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('notes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      important: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('notes');
  },
};
