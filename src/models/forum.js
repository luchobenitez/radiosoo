'use strict';

// Definicion del modelo de Forum con validación
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Forum',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'fid, Primary Key, Forum ID'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Nombre del Foro',
        comment: 'nombre, Nombre del Foro',
        validate: { notEmpty: { msg: '-> Falta Nombre del Foro' } }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'none, Descripción del Foro',
        validate: { notEmpty: { msg: '-> Falta Descripción del Foro' } }
      },
      topicCount: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '0',
        comment: 'detCc, Cantidad de respuestas'
      },
      latestTopic: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'none, Fecha del Ultimo Topic'
      },
      postCount: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '0',
        comment: 'detCc, Cantidad de respuestas'
      },
      latestPost: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'none, Fecha del Ultimo Post'
      },
      status: {
        type: DataTypes.ENUM('A','D'),
        allowNull: false,
        defaultValue: 'A',
        comment: 'estado, Estado del Forum A: Activo, D:Deshabilitado'
      },
      category: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: 0,
        comment: 'cat, categorias'
      }
    }
  );
};
