'use strict';

module.exports = function (sequelize, DataTypes) {
  var BeerpsFolders = sequelize.define(
    'BeerpsFolders',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'nid, Primary Key, User ID'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Folder',
        comment: 'Nombre, Nombre del Folder',
        validate: { notEmpty: { msg: '-> Falta Nombre del BeerpsFolders' } }
      },
      status: {
        type: DataTypes.ENUM('N','A'),
        allowNull: true,
        defaultValue: 'A',
        comment: 'Estado, User status N:normal, A: afuera'
      },
      type: {
        type: DataTypes.ENUM('U','N'),
        allowNull: true,
        defaultValue: 'N',
        comment: 'Tipo, Tipo del BeerpsFolders U:usuario, N: nada'
      },
      dateReaded: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: '1997-01-01 00:00:00',
        validate: { isDate: true },
        comment: 'fechaLeido, BeerpsFolders leido en fecha'
      }
    }
  );
  return BeerpsFolders;
};
