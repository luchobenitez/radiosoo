'use strict';

module.exports = function (sequelize, DataTypes) {
  var BanEmail = sequelize.define(
    'BanEmail',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'log, Primary Key, rsnidlog ID'
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        defaultValue: 'no@radioso.com',
        comment: 'email, User\s email address',
        validate: {
          notEmpty: { msg: '-> Falta email' },
          // hay que devolver un mensaje de error si el username ya existe
          isEmail: true,
          isUnique: function (value, next) {
            var self = this;
            BanEmail.find({ where: { email: value } })
            .then(function (banemail) {
              if (banemail && self.id !== banemail.id) {
                return next('email ya baneado');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
          }
        }
      },
      description: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: 'Razon',
        comment: 'text, Razon de baneo'
      },
    }
  );
  return BanEmail;
};
