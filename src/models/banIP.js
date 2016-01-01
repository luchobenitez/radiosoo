'use strict';

module.exports = function (sequelize, DataTypes) {
  var BanIP = sequelize.define(
    'BanIP',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'none, Primary Key, banip ID'
      },
      ipAddr: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: '00:00:00:00:00:00:00:00',
        validate: { isIP: true },
        comment: 'IP, BAN IP addr'
      },
      class: {
        type: DataTypes.STRING(1),
        allowNull: true,
        comment: 'Clase, Clase de IP baneado'
      },
      status: {
        type: DataTypes.ENUM('A','I'),
        allowNull: false,
        defaultValue: 'A',
        comment: 'estado, Estado del Topico A: Activo, I: deshabilitado'
      }
    }
  );
  return BanIP;
};
