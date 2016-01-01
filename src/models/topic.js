'use strict';

// Definicion del modelo de Topic con validación

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Topic',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'tid, Primary Key, Topic ID'
      },
      titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Titulo',
        comment: 'titulo, Titulo del post',
        validate: { notEmpty: { msg: '-> Falta Titulo del Post' } }
      },
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'texto, Texto del post',
        validate: { notEmpty: { msg: '-> Falta Texto del Post' } }
      },
      avatarid: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '0',
        comment: 'ii, Avatar del user id'
      },
      detailCount: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '0',
        comment: 'detCc, Cantidad de respuestas'
      },
      status: {
        type: DataTypes.ENUM('A','D'),
        allowNull: false,
        defaultValue: 'A',
        comment: 'estado, Estado del Topico A: Activo, D: deshabilitado'
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
