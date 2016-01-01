'use strict';

module.exports = function (sequelize, DataTypes) {
  var Beerp = sequelize.define(
    'Beerp',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'nid, Primary Key, User ID'
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Asunto',
        comment: 'Asunto, Asunto del beerp',
        validate: { notEmpty: { msg: '-> Falta Asunto del Beerp' } }
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'texto, Texto del beerp',
        validate: { notEmpty: { msg: '-> Falta Texto del beerp' } }
      },
      status: {
        type: DataTypes.ENUM('A','D','I','B'),
        allowNull: true,
        defaultValue: 'A',
        comment: 'Estado, User status D:dead, A: active, I:inactive-deleted, B: Banned'
      },
      type: {
        type: DataTypes.ENUM('U','N','B'),
        allowNull: true,
        defaultValue: 'N',
        comment: 'Tipo, Tipo del Beerp U:urgente, N: normal, B:baja prioridad'
      },
      dateReaded: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: '1997-01-01 00:00:00',
        validate: { isDate: true },
        comment: 'fechaLeido, Beerp leido en fecha'
      }
    }
  );
  return Beerp;
};
