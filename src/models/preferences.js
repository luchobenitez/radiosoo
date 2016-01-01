'use strict';

module.exports = function (sequelize, DataTypes) {
  var Preferences = sequelize.define(
    'Preferences',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'none, Primary Key, banip ID'
      },
      attribute: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: '',
        comment: 'Val, attr'
      },
      value: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: '',
        comment: 'Valor, valor del attributo'
      }
    }
  );
  return Preferences;
};
