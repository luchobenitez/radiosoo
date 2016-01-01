'use strict';

// Definicion del modelo de User con validación y encriptación de passwords
var crypto = require('crypto');
var key = process.env.PASSWORD_ENCRYPTION_KEY;

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT(11),
        primaryKey: true,
        autoIncrement: true,
        comment: 'nid, Primary Key, User ID'
      },
      nick: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
        defaultValue: 'none',
        comment:  'nick, User Nick must be unique',
        validate: {
          notEmpty: { msg: '-> Falta nick' },
          // hay que devolver un mensaje de error si el username ya existe
          isUnique: function (value, next) {
            var self = this;
            User.find({ where: { nick: value } })
            .then(function (user) {
              if (user && self.id !== user.id) {
                return next('Nick ya utilizado');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
          }
        }
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'none',
        comment: 'none, Username must be unique',
        validate: {
          notEmpty: { msg: '-> Falta username' },
          // hay que devolver un mensaje de error si el username ya existe
          isUnique: function (value, next) {
            var self = this;
            User.find({ where: { username: value } })
            .then(function (user) {
              if (user && self.id !== user.id) {
                return next('Username ya utilizado');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
          }
        }
      },
      name: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: 'Sin Nombre Alguno',
        comment: 'nombre, User\'s name'
      },
      genre: {
        type: DataTypes.STRING(1),
        allowNull: false,
        defaultValue: 'F',
        comment: 'sexo, User\s genre'
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
            User.find({ where: { email: value } })
            .then(function (user) {
              if (user && self.id !== user.id) {
                return next('email ya utilizado');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
          }
        }
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: '1997-01-01 00:00:00',
        comment: 'fechaNac, User\'s Brith day',
        validate: {
          isDate: true
        }
      },
      dateOfDeath: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: '1000-01-01 00:00:00',
        comment: 'none, User\'s many radiosoo user died',
        validate: {
          isDate: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'none',
        comment: 'pwd, User\'s hashed password',
        validate: {
          notEmpty: { msg: '-> Falta password' },
          set: function (password) {
            var encripted = crypto.createHmac('sha1', key).update(password).digest('hex');
            // Evita passwords vacíos
            if (password === '') {
              encripted = '';
            }
            this.setDataValue('password', encripted);
            console.log(password);
          }
        }
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      salt: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'none',
        comment: 'none, User\'s salt for password'
      },
      authToken: {
        type: DataTypes.STRING(32),
        allowNull: true,
        defaultValue: 'none',
        comment: 'none, hash token for sessions'
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: '1000-01-01 00:00:00',
        comment: 'FechaLogin, User Last Post Datetime',
        validate: {
          isDate: true
        }
      },
      lastSeen: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: '1000-01-01 00:00:00',
        comment: 'none, User Last Seen Datetime',
        validate: {
          isDate: true
        }
      },
      lastPost: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: '1000-01-01 00:00:00',
        comment: 'none, User Last Post Datetime',
        validate: {
          isDate: true
        }
      },
      lastEmail: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: '1000-01-01 00:00:00',
        comment: 'none, User email Datetime',
        validate: {
          isDate: true
        }
      },
      banAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: '1000-01-01 00:00:00',
        comment: 'none, User Ban at Date',
        validate: {
          isDate: true
        }
      },
      banTill: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: '1000-01-01 00:00:00',
        comment: 'none, User Ban Till Date',
        validate: {
          isDate: true
        }
      },
      banCount: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: 0,
        comment: 'none, User Ban count'
      },
      trustLevel: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '0',
        comment: 'none, User Trust Level'
      },
      avatarId: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '0',
        comment: 'none, User avatar ID'
      },
      msgCount: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: 0,
        comment: 'MSGcc, User message count'
      },
      logCount: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: 0,
        comment: 'LOGcc, User login count'
      },
      ipAddr: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: '00:00:00:00:00:00:00:00',
        comment: 'none, User IP addr when create account',
        validate: {
          isIP: true
        }
      },
      status: {
        type: DataTypes.ENUM('A','D','I','B'),
        allowNull: true,
        defaultValue: 'A',
        comment: 'Estado, User status D:dead, A: active, I:inactive-deleted, B: Banned'
      },
      iconId: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '00',
        comment: 'Ii, User old icon id'
      },
      preferenceId: {
        type: DataTypes.BIGINT(11),
        allowNull: true,
        defaultValue: '00',
        comment: 'Prefs, User preferences id'
      },
      location: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: '00',
        comment: 'LOC, User geolocation'
      }
    },
    {
      instanceMethods:
      {
        verifyPassword: function (password) {
          var encripted = crypto.createHmac('sha1', key).update(password).digest('hex');
          return encripted === this.password;
        },
        updateLastLogin: function (ip) {
          this.update({
            lastLogin: new Date(),
            logCount: sequelize.literal('logCount +1'),
            ipAddr: ip
          });
        },
        updateLastSeen: function () {
          this.update({
            lastSeen: new Date(),
            msgCount: sequelize.literal('msgCount +1')
          });
        },
        updateLastPost: function () {
          this.update({
            lastPost: new Date(),
            msgCount: sequelize.literal('msgCount +1')
          });
        }
      },
      privateColumns: ['password']
    }
  );
  return User;
};
