'use strict';

var models = require('../models/models.js');
var passport = require('passport');
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// USERS CRUD

// GET /session
exports.index = function (req, res, next) {
  models.Session.findAll({
    }).then(
      function (session) {
        res.render('session/index', { title: 'Session', sessions: session, errors: [], message: req.flash('error') });
      }
  ).catch(function (error) { next(error); });
};

// GET /session/create
exports.create = function (req, res) {
  var options = {};
  var errors = req.session.errors || {};
  var message = req.session.flash();
  req.session.errors = {};
  // req.session.destroy();
  var session = models.Session.build({ mode: '' });

  res.render('sessions/create', { title: 'Login', session: session, errors: errors, message: req.flash('error') });
  // res.render('sessions/create', {title: 'Login', errors: errors });
};

// POST /session
exports.store = function (req, res, next) {
  var login     = req.body.login;
  var password  = req.body.password;
  var session = models.Session.build(req.body.session);
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var userController = require('./user');

  userController.autenticar(login, password, function (error, user) {
    if (error) {  // si hay error retornamos mensajes de error de sesión
      req.session.errors = [{ 'message': 'fallo de login' }];
      res.redirect('/login');
      return;
    }

    user.updateLastLogin(ip);
    var UserId = user.id;
    session
    .validate()
    .then(
      function (err) {
        if (err) {
          res.render('session/create',
          { title: 'Crear Sesion', session: session, errors: err.errors, message: req.flash('error') });
        } else {
          session // save: guarda en DB campos
          .save({ fields: ['mode', 'UserId'] })
          .then(function (session) {
            console.log('Session save OK');
            // Crear req.session.user y guardar campos   id  y  username
            // La sesión se define por la existencia de:    req.session.user
            req.session.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };
            req.session.session = { id: session.id, mode: session.mode };
            // res.redirect('/topics');
            // redirección a path anterior a login
            res.redirect(req.session.redir.toString());
          });
        }
      }
    ).catch(function (error) { next(error); });
  });
};

// GET /session/:id
// req.session: instancia de session cargada con autoload
exports.show = function (req, res) {
  res.render('session/show',
  {
    title: 'Mostrar Sesion',
    session: req.session,
    errors: [],
    message: req.flash('error')
  });
};

// GET /session/:id/edit
// req.session: instancia de session cargada con autoload
exports.edit = function (req, res) {
  res.render('session/edit',
  {
    title: 'Editar Topico',
    session: req.session,
    errors: [], message:
    req.flash('error')
  });
};

// PUT /session/:id
exports.update = function (req, res, next) {
  req.session.mode = req.body.session.mode;

  req.session
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('session/' + req.body.session.id + '/edit',
        {
          title: 'Editar Sesion',
          session: req.session,
          errors: err.errors,
          message: req.flash('error')
        });
      } else {
        req.session
        .save({ fields: ['mode'] })
        .then(function () { res.redirect('/topics'); });
      }
    }
  ).catch(function (error) { next(error); });
};

// DELETE /session/:id
// req.session: instancia de session cargada con autoload
exports.destroy = function (req, res, next) {
  console.log('session Destroy');
  console.log(req.session);
  req.session.destroy().then(function () {
    delete req.session.session;
    res.redirect('/topics');
  }).catch(function (error) { next(error); });
};

// USERS HELPERS

// Autoload :id
exports.load = function (req, res, next, sessionId) {
  models.Session.findOne({
    where: { id: Number(sessionId) }
  }).then(function (session) {
    if (session) {
      req.session = session;
      next();
    } else { next(new Error('No existe sessionId=')); }
  }
).catch(function (error) { next(error); });
};

// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.errors = new Error('Necesita logearse');
    res.redirect('/login');
  }
};

// DELETE /logout   -- Destruir sesion
exports.destroyOld = function (req, res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};

// SESSION PASSPORT HELPERS

// GET /login
exports.passportLocalCreate = function (req, res) {
  //  var options = {};
  var errors = req.session.errors || {};
  //  var message = req.session.errors;
  //  req.session.errors = {};
  //    req.session.destroy();
  var session = models.Session.build({ mode: 'A' });

  res.render('sessions/create',
  { title: 'Login', session: session, errors: errors });
  //  res.render('sessions/create', {title: 'Login', errors: errors });
};

// POST /login
exports.passportLocalStore = passport.authenticate('local-signup', {
  successRedirect: '/forum',
  failureRedirect: '/login',
  failureFlash: true
});

exports.passportLocalLogout = function (req, res, next) {
  var UserId     = req.user.id;
  var mode       = 'I';

  console.log('Session logout pre save ');
  console.log(req.user.id);
  models.Session.findOne({
    where: {
      UserId: Number(UserId),
      mode: 'A'
    }
  }).then(function (session) {
    if (session) {
      session.mode = 'I';
      session.deletedAt = new Date();
      session.save()
      .then(function (session) {
        console.log('Session off save OK');
        req.session.regenerate(function () {
          req.logout();
          req.flash('success', 'Passport: Success Logout');
          res.redirect('/');
        });
        // next();
      });
    }
  }).catch(function (error) { next(error); });
};
