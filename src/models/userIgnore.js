'use strict';

module.exports = function (sequelize, DataTypes) {
  var UserIgnore = sequelize.define(
    'UserIgnore',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'nid, Primary Key, User ID'
      },
      from: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '0',
        comment: 'frNID, From User ID'
      },
      to: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '0',
        comment: 'toNID, To User ID'
      },
      status: {
        type: DataTypes.ENUM('A','I'),
        allowNull: true,
        defaultValue: 'A',
        comment: 'Estado, User status A: active, I:inactive'
      }
    }
  );
  return UserIgnore;
};
