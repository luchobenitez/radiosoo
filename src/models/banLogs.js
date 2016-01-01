'use strict';

module.exports = function (sequelize, DataTypes) {
  var BanLogs = sequelize.define(
    'BanLogs',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'log, Primary Key, rsbanlog ID'
      },
      fechaLog: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: '1000-01-01 00:00:00',
        comment: 'fecha, Logs datetime',
        validate: {
          isDate: true
        }
      }
    }
  );
  return BanLogs;
};
