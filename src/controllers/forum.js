'use strict';

var models = require('../models/models.js');

// TOPICS CRUD

// GET /forum/:id/topics
exports.ftindex = function (req, res, next) {
  console.log('req.forum.id');
  // console.log(req.forum.id);
  models.Forum.findOne({
    where: { id: req.forum.id },
    include: [ {
      model: models.Topic,
      include: [models.User]
    } ]
    // models.Topic.findAll({ include: [{ model: models.User }]
  }).then(
    function (forum) {
      // console.log(forum);
      res.render('forumTopics/index.ejs',
      { title: 'Forum/Topicos', forum: forum, errors: [] });
    }
  ).catch(function (error) { next(error); });
};

// GET /forum/:id/topics
exports.ftcreate = function (req, res) {
  var topic = models.Topic.build(
    { titulo: '', texto: '' }
  );
  res.render('topics/edit', { title: 'Registrar Topic', topic: topic, errors: [] });
};

// POST /forum/:id/topics
exports.ftstore = function (req, res, next) {
  var topic = models.Topic.build(req.body.topic);

  topic
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('topics/edit', { title: 'Nuevo Topic', topic: topic, errors: err.errors });
      } else {
        topic // save: guarda en DB campos pregunta y respuesta de topic
        .save({ fields: [
          'titulo', 'texto', 'UserId'
        ] })
        .then(function () { res.redirect('/topics'); });
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function (error) { next(error); });
};

// GET /forum/:id/topics/:id
// req.topic: instancia de topic cargada con autoload
exports.ftshow = function (req, res) {
  res.render('topics/show', { title: 'Topic', topics: req.topic, errors: [] });
};

// GET /forum/:id/topics/:id/edit
// req.topic: instancia de topic cargada con autoload
exports.ftedit = function (req, res) {
  res.render('topics/edit', { title: 'Editar Topic', topic: req.topic, errors: [] });
};

// PUT /forum/:id/topics/:id
exports.ftupdate = function (req, res, next) {
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
        req.topic     // save: guarda campos pregunta y respuesta en DB
        .save({ fields: [
          'titulo', 'texto'
        ] })
        .then(function () { res.redirect('/topics'); });
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function (error) { next(error); });
};

// DELETE /forum/:id/topics/:id
// req.topic: instancia de topic cargada con autoload
exports.ftdestroy = function (req, res, next) {
  req.topic.destroy().then(function () {
    res.redirect('/topics');
  }).catch(function (error) { next(error); });
};

// TOPICS->COMMENTS CRUD

// GET /topics/:topicId(\\d+)/comments/details
exports.ftdetails = function (req, res, next) {
  models.Topic.findOne( {
      where: { id: req.topic.id },
      include: [
        {
          model: models.CommentDB,
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

// FORUMS CRUD

// GET /forums
exports.index = function (req, res, next) {
  models.Forum.findAll({
    }).then(
      function (forum) {
        res.render('forums/index', { title: 'Forum', forums: forum });
      }
    ).catch(function (error) { next(error); });
};

// GET /forums
exports.create = function (req, res) {
  var forum = models.Forum.build(
    { name: '', registeredAt: '', modifiedAt: '', detailCount: '', category: '' }
  );
  res.render('forums/edit', { title: 'Registrar Foro', forum: forum, errors: [] });
};

// POST /forums/
exports.store = function (req, res, next) {
  var forum = models.Forum.build(req.body.forum);

  forum
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('forums/edit', { title: 'Crear Forum', forum: forum, errors: err.errors });
      } else {
        forum // save: guarda en DB campos
        .save({ fields: [
          'name', 'registeredAt', 'modifiedAt', 'detailCount', 'category'
        ] })
        .then(function () { res.redirect('/forum'); });
      }
    }
  ).catch(function (error) { next(error); });
};

// GET /forums/:id
// req.forum: instancia de forum cargada con autoload
exports.show = function (req, res) {
  res.render('forums/show', { title: 'Forum', forums: req.forum, errors: [] });
};

// GET /forums/:id/edit
// req.forum: instancia de forum cargada con autoload
exports.edit = function (req, res) {
  res.render('forums/edit', { title: 'Editar Foro', forum: req.forum, errors: [] });
};

// PUT /forums/:id
exports.update = function (req, res, next) {
  //  var req.forum = models.Forum.build( req.body.forum );
  req.forum.name = req.body.forum.name;
  req.forum.status = req.body.forum.status;
  req.forum.category = req.body.forum.category;
  req.forum.modifiedAt = new Date();

  req.forum
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('forums/' + req.body.forum.id + '/edit',
        { title: 'Editar Forums', forum: req.forum, errors: err.errors });
      } else {
        req.forum
        .save({ fields: [
          'name', 'status', 'modifiedAt', 'category'
        ] })
        .then(function () { res.redirect('/forum'); });
      }
    }
  ).catch(function (error) { next(error); });
};

// DELETE /forums/:id
// req.forum: instancia de forum cargada con autoload
exports.destroy = function (req, res, next) {
  req.forum.destroy().then(function () {
    res.redirect('/forum');
  }).catch(function (error) { next(error); });
};

// FORUMS HELPERS

// MW que permite acciones solamente si el forum objeto pertenece al usuario logeado o si es cuenta admin
exports.isAdmin = function (req, res, next) {
  var isAdmin = req.session.user.isAdmin;

  if (isAdmin) {
    next();
  } else {
    res.redirect('/');
  }
};

// Autoload :id
exports.load = function (req, res, next, forumId) {
  console.log(forumId);
  models.Forum.findOne({
    where: { id: Number(forumId) }
  }).then(function (forum) {
      if (forum) {
        req.forum = forum;
        next();
      } else {next(new Error('No existe forumId='));}
    }
  ).catch(function (error) { next(error); });
};
