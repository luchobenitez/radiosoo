'use strict';

module.exports = function (sequelize, DataTypes) {
  var UsersChangeLogs = sequelize.define(
    'UsersChangeLogs',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'log, Primary Key, rsnidchg ID'
      },
      fechaLog: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: '1000-01-01 00:00:00',
        comment: 'fechaLog, Logs datetime',
        validate: {
          isDate: true
        }
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '',
        comment: 'Nombre, User Name'
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'FechaNac, Fecha de Nacimiento'
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '',
        comment: 'PWD, User Password'
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '',
        comment: 'Email, User Mail'
      }
    }
  );
  return UsersChangeLogs;
};
