'use strict';

// Definicion del modelo de Topic con validación

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'Comment',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'det, Primary Key, detalle  ID'
      },
      texto: {
        type: DataTypes.TEXT,
        allowNull: false,
        // Default Value para TEXT solo en SQLLite
        // defaultValue: 'Texto del Post',
        comment: 'texto, Texto del post',
        validate: { notEmpty: { msg: '-> Falta Comentario' } }
      },
      status: {
        type: DataTypes.ENUM('A','D'),
        allowNull: false,
        defaultValue: 'A',
        comment: 'estado, Estado del Topico A: activo, D: deshabilitado'
      },
      publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }
  );
};
