'use strict';

module.exports = function (sequelize, DataTypes) {
  var ModeratorLogs = sequelize.define(
    'ModeratorLogs',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'nid, Primary Key, ModeratorLogs ID'
      },
      eventDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Motivo, Descripcion del motivo',
        validate: { notEmpty: { msg: '-> Falta Texto del Post' } }
      },
      status: {
        type: DataTypes.ENUM('A','D','I','B'),
        allowNull: true,
        defaultValue: 'A',
        comment: 'Estado, ModeratorLogs status D:dead, A: active, I:inactive-deleted, B: Banned'
      }
    }
  );
  return ModeratorLogs;
};
