'use strict';

var express = require('express');
var multer  = require('multer');
var router = express.Router();
var passport = require('passport');
var flash    = require('express-flash');

require('../config/passport')(passport);

var forumController = require('../controllers/forum');
var topicController = require('../controllers/topic');
var commentController = require('../controllers/comment');
var sessionController = require('../controllers/session');
var userController = require('../controllers/user');
var frontController = require('../controllers/front');

// *** PAGES
// Página de entrada (home page)
router.get('/',             frontController.showHomePage);     // HomePage
// Definición de uso de cookies
router.get('/cookies',      frontController.showCookies);     // Cookies
// Definición de rutas de terminos
router.get('/terminos',     frontController.showTerms);     // Terminos
// Definición de rutas de About
router.get('/privacidad',   frontController.showPrivacidad);     // Terminos
// Definición de rutas de About
router.get('/about',        frontController.showAbout);     // Terminos
// Definición de Nuestra Historia
router.get('/historiasoo',  frontController.showHistoriaSoo);     // HistoriaSoo
// Definición de Donar
router.get('/donar',        frontController.showDonar);     // Donar
// Definición de Sponsors
router.get('/sponsor',      frontController.showSponsor);     // Sponsor

// Autoload de comandos con ids
router.param('forumId',     forumController.load);     // autoload :forumId
router.param('topicId',     topicController.load);     // autoload :topicId
router.param('commentId',   commentController.load);  // autoload :commentId
router.param('userId',      userController.load);     // autoload :userId
router.param('sessionId',   sessionController.load);  // autoload :sessionId

// *** SESSION
// Definición de rutas de sesion
router.get('/login',  sessionController.passportLocalCreate);  // formulario login
router.post('/login', sessionController.passportLocalStore);   // guardar sesión
router.get('/logout', sessionController.passportLocalLogout);

// *** FORUM CRUD
// LIST ALL
router.get('/forum',      forumController.index);
// CREATE FORUM
router.get('/forum/create',
  sessionController.loginRequired, forumController.isAdmin, forumController.create);
router.post('/forum',
  sessionController.loginRequired, forumController.isAdmin, forumController.store);
// READ FORUM
router.get('/forum/:forumId(\\d+)',
  sessionController.loginRequired, forumController.isAdmin, forumController.show);
// UPDATE FORUM
router.get('/forum/:forumId(\\d+)/edit',
  sessionController.loginRequired, forumController.isAdmin, forumController.edit);
router.put('/forum/:forumId(\\d+)',
  sessionController.loginRequired, forumController.isAdmin, forumController.update);
// DELETE FORUM
router.delete('/forum/:forumId(\\d+)',
  sessionController.loginRequired,  forumController.isAdmin, forumController.destroy);

// *** USER CRUD
router.get('/user',
  sessionController.loginRequired,  userController.index);     // guardar usuario
// CREATE USER
router.get('/user/create',
  userController.create);    // formulario sign un
router.post('/user',
  userController.store);     // guardar usuario
// READ USER
router.get('/user/:userId(\\d+)',
  sessionController.loginRequired, userController.show);     // editar información de cuenta
// UPDATE USER
router.get('/user/:userId(\\d+)/edit',
  sessionController.loginRequired, userController.ownershipRequired,
  userController.edit);     // editar información de cuenta
router.put('/user/:userId(\\d+)',
  sessionController.loginRequired, userController.ownershipRequired,
  userController.update);     // actualizar información de cuenta
// DELETE USER
router.delete('/user/:userId(\\d+)',
  sessionController.loginRequired, userController.ownershipRequired,
  userController.destroy);     // borrar cuenta

// *** FORUM TOPICS CRUD
router.get('/forum/:forumId(\\d+)/topics',
  forumController.ftindex);     // listar topics
// CREATE USER
router.get('/forum/:forumId(\\d+)/topics/create',
  sessionController.loginRequired, forumController.ftcreate);    // crear topic
router.post('/forum/:forumId(\\d+)/topics',
  sessionController.loginRequired, forumController.ftstore);     // guardar topic
// READ USER
router.get('/forum/:forumId(\\d+)/topics/:topicId(\\d+)',
  forumController.ftshow);     // mostrar un topic
// UPDATE USER
router.get('/forum/:forumId(\\d+)/topics/:topicId(\\d+)/edit',
  sessionController.loginRequired, topicController.ownershipRequired,
  forumController.ftedit);     // editar topic
router.put('/forum/:forumId(\\d+)/topics/:topicId(\\d+)',
  sessionController.loginRequired, topicController.ownershipRequired,
  forumController.ftupdate);     // actualizar topic
// DELETE USER
router.delete('/forum/:forumId(\\d+)/topics/:topicId(\\d+)',
  sessionController.loginRequired, topicController.ownershipRequired,
  forumController.ftdestroy);     // borrar topic

// TOPICS->COMMENTS
router.get('/forum/:forumId(\\d+)/topics/:topicId(\\d+)/comments/details',
  forumController.ftdetails);     // listar topics y comments

// *** ONLY TOPICS CRUD
router.get('/topics',
  topicController.index);     // listar topics
// CREATE USER
router.get('/topics/create',
  sessionController.loginRequired, topicController.create);    // crear topic
router.post('/topics',
  sessionController.loginRequired, topicController.store);     // guardar topic
// READ USER
router.get('/topics/:topicId(\\d+)',
  topicController.show);     // mostrar un topic
// UPDATE USER
router.get('/topics/:topicId(\\d+)/edit',
  sessionController.loginRequired, topicController.ownershipRequired,
  topicController.edit);     // editar topic
router.put('/topics/:topicId(\\d+)',
  sessionController.loginRequired, topicController.ownershipRequired,
  topicController.update);     // actualizar topic
// DELETE USER
router.delete('/topics/:topicId(\\d+)',
  sessionController.loginRequired, topicController.ownershipRequired,
  topicController.destroy);     // borrar topic

// TOPICS->COMMENTS
router.get('/topics/:topicId(\\d+)/comments/details',
  topicController.details);     // listar topics y comments

// *** COMMENTS CRUD
router.get('/topics/:topicId(\\d+)/comment',
  commentController.index);     // listar topics
// CREATE USER
router.get('/topics/:topicId(\\d+)/comment/create',
  sessionController.loginRequired, commentController.create);    // crear topic
router.post('/topics/:topicId(\\d+)/comment',
  sessionController.loginRequired, commentController.store);     // guardar topic
// READ USER
router.get('/topics/:topicId(\\d+)/comment/:commentId(\\d+)',
  commentController.show);     // mostrar un topic
// UPDATE USER
router.get('/topics/:topicId(\\d+)/comment/:commentId(\\d+)/edit',
  sessionController.loginRequired, topicController.ownershipRequired,
  commentController.edit);     // editar topic
router.put('/topics/:topicId(\\d+)/comment/:commentId(\\d+)',
  sessionController.loginRequired, topicController.ownershipRequired,
  commentController.update);     // actualizar topic
// DELETE USER
router.delete('/topics/:topicId(\\d+)/comment/:commentId(\\d+)',
  sessionController.loginRequired, topicController.ownershipRequired,
  commentController.destroy);     // borrar topic

module.exports = router;
