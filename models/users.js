'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    uid: DataTypes.STRING,
    name: DataTypes.STRING,
    passwd_hash: DataTypes.STRING
  }, {
    underscored: true,
  });
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};