'use strict';

var models = require('../models/models.js');

// TOPICS CRUD

// GET /topics
exports.index = function (req, res, next) {
  models.Topic.findAll({
    include: [ { model: models.User } ]
  }).then(
    function (topics) {
      res.render('topics/index.ejs', { title: 'Topicos', topics: topics, errors: [] });
    }
  ).catch(function (error) { next(error); });
};

// GET /topics
exports.create = function (req, res) {
  var topic = models.Topic.build(
    { titulo: '', texto: '' }
  );
  res.render('topics/create', { title: 'Registrar Topic', topic: topic, errors: [] });
};

// POST /topics
exports.store = function (req, res, next) {
  var topic = models.Topic.build(req.body.topic);
  topic
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('topics/edit', { title: 'Nuevo Topic', topic: topic, errors: err.errors });
      } else {
        topic
        .save({ fields: [
          'titulo', 'texto', 'UserId', 'ForumId'
        ] })
        .then(function () { res.redirect('/topics'); });
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function (error) { next(error); });
};

// GET /topics/:id
// req.topic: instancia de topic cargada con autoload
exports.show = function (req, res) {
  res.render('topics/show', { title: 'Topic', topics: req.topic, errors: [] });
};

// GET /topics/:id/edit
// req.topic: instancia de topic cargada con autoload
exports.edit = function (req, res) {
  res.render('topics/edit', { title: 'Editar Topic', topic: req.topic, errors: [] });
};

// PUT /topics/:id
exports.update = function (req, res, next) {
  req.topic.titulo = req.body.topic.titulo;
  req.topic.texto = req.body.topic.texto;
  req.topic.modifiedAt = new Date();

  req.topic
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('topics/' + req.body.topic.id + '/edit',
        { title: 'Editar Topicos', topic: req.topic, errors: err.errors });
      } else {
        req.topic
        .save({ fields: [
          'titulo', 'texto'
        ] })
        .then(function () { res.redirect('/topics'); });
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function (error) { next(error); });
};

// DELETE /topics/:id
// req.topic: instancia de topic cargada con autoload
exports.destroy = function (req, res, next) {
  req.topic.destroy().then(function () {
    res.redirect('/topics');
  }).catch(function (error) { next(error); });
};

// TOPICS->COMMENTS CRUD

// GET /topics/:topicId(\\d+)/comments/details
exports.details = function (req, res, next) {
  models.Topic.findOne({
    where: { id: req.topic.id },
    include: [
      {
        model: models.Comment,
        include: [models.User]
      },
      { model: models.User }
    ]
  }).then(
    function (topic) {
      res.render('topics/details', { title: 'Topicos', topic: topic, errors: [] });
    }
  ).catch(function (error) { next(error); });
};

// TOPCIS HELPERS

// MW que permite acciones solamente si el topic objeto pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function (req, res, next) {
  var objTopicOwner = req.topic.UserId;
  var logUser = req.session.user.id;
  var isAdmin = req.session.user.isAdmin;

  if (isAdmin || objTopicOwner === logUser) {
    console.log('Topic ownershipRequired, OK');
    next();
  } else {
    console.log('Topic ownershipRequired, NOK');
    res.redirect('/');
  }
};

// Autoload :id
exports.load = function (req, res, next, topicId) {
  models.Topic.findOne({
    where: { id: Number(topicId) },
    include: [{ model: models.User }]
  }).then(function (topic) {
      if (topic) {
        req.topic = topic;
        next();
      } else {next(new Error('No existe topicId=' + topicId));}
    }
  ).catch(function (error) { next(error); });
};
