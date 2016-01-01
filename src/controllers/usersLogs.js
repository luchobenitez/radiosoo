'use strict';

var models = require('../models/models.js');

// USERS CRUD

// GET /usersLog
exports.index = function (req, res, next) {
  models.UsersLogsfindAll({
    }).then(
      function (usersLog) {
        res.render('usersLog/index', { title: 'Logs de Usuarios', usersLogs: usersLog, errors: [] });
      }
  ).catch(function (error) { next(error); });
};

// GET /usersLog/create
exports.create = function (req, res) {
  var usersLog = models.UsersLogsbuild(
    { username: '', password: '' }
  );
  res.render('usersLog/create', { title: 'Registrar Usuario', usersLog: usersLog, errors: [] });
};

// POST /usersLog
exports.store = function (req, res, next) {
  var usersLog = models.UsersLogsbuild(req.body.usersLog);

  usersLog
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('usersLog/create', { title: 'Crear Usuario', usersLog: usersLog, errors: err.errors });
      } else {
        usersLog // save: guarda en DB campos
        .save({ fields: [
          'id', 'nick', 'username', 'name', 'genre', 'email', 'dateOfBirth',
          'password', 'registeredAt', 'modifiedAt', 'lastLogin', 'lastSeen',
          'lastPost', 'lastEmail', 'status'
        ] })
        .then(function () {
          // crea la sesión para que el usuario acceda ya autenticado y redirige a /
          req.session.usersLog = { id: usersLog.id, username: usersLog.username };
          res.redirect('/topics');
        });
      }
    }
  ).catch(function (error) { next(error); });
};

// GET /usersLog/:id
// req.usersLog: instancia de usersLog cargada con autoload
exports.show = function (req, res) {
  res.render('usersLog/show', { title: 'Mostrar Usuario', usersLog: req.usersLog, errors: [] });
};

// GET /usersLog/:id/edit
// req.usersLog: instancia de usersLog cargada con autoload
exports.edit = function (req, res) {
  res.render('usersLog/edit', { title: 'Editar Topico', usersLog: req.usersLog, errors: [] });
};

// PUT /usersLog/:id
exports.update = function (req, res, next) {
  req.usersLog.username  = req.body.usersLog.username;
  req.usersLog.name  = req.body.usersLog.name;
  req.usersLog.genre  = req.body.usersLog.genre;
  req.usersLog.mail  = req.body.usersLog.mail;
  req.usersLog.dateOfBirth  = req.body.usersLog.dateOfBirth;
  req.usersLog.password  = req.body.usersLog.password;
  req.usersLog.modifiedAt = new Date();

  req.usersLog
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('usersLog/' + req.body.usersLog.id + '/edit',
        { title: 'Editar Usuario', usersLog: req.usersLog, errors: err.errors });
      } else {
        req.usersLog
        .save({ fields: [
          'username', 'password', 'name', 'genre', 'mail', 'dateOfBirth', 'modifiedAt'
        ] })
        .then(function () {res.redirect('/topics'); });
      }
    }
  ).catch(function (error) { next(error); });
};

// DELETE /usersLog/:id
// req.usersLog: instancia de usersLog cargada con autoload
exports.destroy = function (req, res, next) {
  req.usersLog.destroy().then(function () {
    delete req.session.usersLog;
    res.redirect('/topics');
  }).catch(function (error) { next(error); });
};

// USERS HELPERS

// MW que permite acciones solamente si el usuario objeto corresponde con el usuario logeado o si es cuenta admin
exports.ownershipRequired = function (req, res, next) {
  var objUser = req.usersLog.id;
  var logUser = req.session.usersLog.id;
  var isAdmin = req.session.usersLog.isAdmin;

  if (isAdmin || objUser === logUser) {
    console.log('User ownershipRequired, OK');
    next();
  } else {
    console.log('User ownershipRequired, NOK');
    res.redirect('/');
  }
};

// Autoload :id
exports.load = function (req, res, next, usersLogId) {
  models.UsersLogsfindOne({
    where: { id: Number(usersLogId) }
  }).then(function (usersLog) {
    if (usersLog) {
      req.usersLog = usersLog;
      next();
    } else { next(new Error('No existe usersLogId=' + usersLogId));}
  }
).catch(function (error) { next(error); });
};

// Comprueba si el usuario esta registrado en usersLogs
// Si autenticación falla o hay errores se ejecuta callback(error).
exports.autenticar = function (login, password, callback) {
  models.UsersLogsfind({
    where: {
      username: login
    }
  }).then(function (usersLog) {
    if (usersLog) {
      if (usersLog.verifyPassword(password)) {
        console.log('Password OK');
        callback(null, usersLog);
      }	else {
        console.log('Password NOK P');
        callback(new Error('eMail o Password invalido'));
      }
    } else {
      console.log('Password NOK U');
      callback(new Error('eMail o Password invalido'));
    }
  }).catch(function (error) { callback(error); });
};
