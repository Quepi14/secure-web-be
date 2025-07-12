const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..','data.db'),
  logging: false
});

// Init model
const user = require('./userModel')(sequelize, DataTypes);
const comment = require('./commentModel')(sequelize, DataTypes);
const log = require('./logModel')(sequelize, DataTypes);

// Relasi antar model
user.hasMany(comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
comment.belongsTo(user, { foreignKey: 'user_id', onDelete: 'CASCADE' });

user.hasMany(log, { foreignKey: 'user_id', onDelete: 'CASCADE' });
log.belongsTo(user, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  user,
  comment,
  log
};
