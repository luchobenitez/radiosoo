'use strict';

module.exports = function (sequelize, DataTypes) {
  var Attributes = sequelize.define(
    'Attributes',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'old:VAL, Primary key of Attribute'
      },
      name: {
        type: DataTypes.STRING(80),
        allowNull: false,
        defaultValue: '',
        comment: 'old:Nombre, Name of Attribute'
      },
      value: {
        type: DataTypes.STRING(80),
        allowNull: false,
        defaultValue: '',
        comment: 'old:Valor, Value of Attribute'
      },
      status: {
        type: DataTypes.ENUM('C','N'),
        allowNull: false,
        defaultValue: 'C',
        comment: 'old:Estado, Status of Attribute N: Normal, C: constant'
      },
      type: {
        type: DataTypes.ENUM('B','I'),
        allowNull: true,
        defaultValue: 'B',
        comment: 'old:Tipo, Type of Attribute B: ??, I: ??'
      },
    },{
      timestamps: true,
      paranoid: true,
      underscore: false,
      freezeTableName: false,
      comment: 'radiosoo.rsval',
      defaultScope: {
        active: true
      },
      scopes: {
        deleted: {
          where: {
            deleted: true
          }
        }
      }
    }
  );
  return Attributes;
};
