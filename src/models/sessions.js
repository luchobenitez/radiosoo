'use strict';

module.exports = function (sequelize, DataTypes) {
  var Sessions = sequelize.define(
    'Sessions',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'SID, Primary Key, Session Id'
      },
      mode: {
        type: DataTypes.ENUM('A','I'),
        allowNull: false,
        defaultValue: 'A',
        comment: 'mode, Session mode A: Activo, I: Inactivo'
      }
    },{
      timestamps: true,
      paranoid: true,
      underscore: false,
      freezeTableName: false,
      comment: 'radiosoo.rssid',
      defaultScope: {
        active: true
      },
      scopes: {
        deleted: {
          where: {
            deleted: true
          }
        }
      }
    }
  );

  return Sessions;
};
