'use strict';
module.exports = (sequelize, DataTypes) => {
  const scores = sequelize.define('scores', {
    uid: DataTypes.STRING,
    score: DataTypes.FLOAT
  }, {
    underscored: true,
  });
  scores.associate = function(models) {
    // associations can be defined here
  };
  return scores;
};