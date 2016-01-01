'use strict';

module.exports = function (sequelize, DataTypes) {
  var Moderator = sequelize.define(
    'Moderator',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'nid, Primary Key, Moderator ID'
      },
      status: {
        type: DataTypes.ENUM('A','D','I','B'),
        allowNull: true,
        defaultValue: 'A',
        comment: 'Estado, Moderator status D:dead, A: active, I:inactive-deleted, B: Banned'
      }
    }
  );
  return Moderator;
};
