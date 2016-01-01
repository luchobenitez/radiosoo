'use strict';

module.exports = function (sequelize, DataTypes) {
  var UsersLogs = sequelize.define(
    'UsersLogs',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'log, Primary Key, rsnidlog ID'
      },
      ipAddr: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: '00:00:00:00:00:00:00:00',
        comment: 'none, User IP addr when create account',
        validate: {
          isIP: true
        }
      },
      prevUserId: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        comment: 'prevNID, Previous User ID'
      },
      lastUserId: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        comment: 'lastNID, Previous User ID'
      }
    }
  );
  return UsersLogs;
};
