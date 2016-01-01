'use strict';

var models = require('../models/models.js');

// USERS CRUD

// GET /user
exports.index = function (req, res, next) {
  models.User.findAll({
  }).then(
    function (user) {
      res.render('user/index', { title: 'Users', users: user, errors: [] });
    }
  ).catch(function (error) {next(error);});
};

// GET /user/create
exports.create = function (req, res) {
  var user = models.User.build(
    { username: '', password: '' }
  );
  res.render('user/create', { title: 'Registrar Usuario', user: user, errors: [] });
};

// POST /user
exports.store = function (req, res, next) {
  var user = models.User.build(req.body.user);

  user
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('user/create', { title: 'Crear Usuario', user: user, errors: err.errors });
      } else {
        user // save: guarda en DB campos
        .save({ fields: [
          'id', 'nick', 'username', 'name', 'genre', 'email', 'dateOfBirth',
          'password', 'registeredAt', 'modifiedAt', 'lastLogin', 'lastSeen',
          'lastPost', 'lastEmail', 'status'
        ] })
        .then(function () {
          // crea la sesión para que el usuario acceda ya autenticado y redirige a /
          req.session.user = { id: user.id, username: user.username };
          res.redirect('/topics');
        });
      }
    }
  ).catch(function (error) { next(error); });
};

// GET /user/:id
// req.user: instancia de user cargada con autoload
exports.show = function (req, res) {
  res.render('user/show', { title: 'Mostrar Usuario', user: req.user, errors: [] });
};

// GET /user/:id/edit
// req.user: instancia de user cargada con autoload
exports.edit = function (req, res) {
  res.render('user/edit', { title: 'Editar Topico', user: req.user, errors: [] });
};

// PUT /user/:id
exports.update = function (req, res, next) {
  req.user.username  = req.body.user.username;
  req.user.name  = req.body.user.name;
  req.user.genre  = req.body.user.genre;
  req.user.mail  = req.body.user.mail;
  req.user.dateOfBirth  = req.body.user.dateOfBirth;
  req.user.password  = req.body.user.password;
  req.user.modifiedAt = new Date();

  req.user
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('user/' + req.body.user.id + '/edit',
        {
          title: 'Editar Usuario',
          user: req.user,
          errors: err.errors
        });
      } else {
        req.user
        .save({ fields: [
          'username', 'password', 'name', 'genre', 'mail', 'dateOfBirth', 'modifiedAt'
        ] })
        .then(function () { res.redirect('/topics'); });
      }
    }
  ).catch(function (error) { next(error); });
};

// DELETE /user/:id
// req.user: instancia de user cargada con autoload
exports.destroy = function (req, res, next) {
  req.user.destroy().then(function () {
    delete req.session.user;
    res.redirect('/topics');
  }).catch(function (error) { next(error); });
};

// USERS HELPERS

// MW que permite acciones solamente si el usuario objeto corresponde con el usuario logeado o si es cuenta admin
exports.ownershipRequired = function (req, res, next) {
  var objUser = req.user.id;
  var logUser = req.session.user.id;
  var isAdmin = req.session.user.isAdmin;

  if (isAdmin || objUser === logUser) {
    console.log('User ownershipRequired, OK');
    next();
  } else {
    console.log('User ownershipRequired, NOK');
    res.redirect('/');
  }
};

// Autoload :id
exports.load = function (req, res, next, userId) {
  models.User.findOne({
    where: { id: Number(userId) }
  }).then(function (user) {
    if (user) {
      req.user = user;
      next();
    } else {next(new Error('No existe userId=' + userId));}
  }
).catch(function (error) { next(error); });
};

// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error).
exports.autenticar = function (email, password, callback) {
  models.User.find({
    where: {
      email: email
    }
  }).then(function (user) {
    if (user) {
      if (user.verifyPassword(password)) {
        console.log('UserController.autenticar: Password OK');
        callback(null, user);
      }	else {
        console.log('UserController.autenticar: Password NOK P');
        callback(new Error('eMail o Password invalido'));
      }
    } else {
      console.log('UserController.autenticar: Password NOK U');
      callback(new Error('eMail o Password invalido'));
    }
  }).catch(function (error) { callback(error); });
};
