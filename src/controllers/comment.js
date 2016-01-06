'use strict';

var models = require('../models/models.js');
var SqlString = require('../../node_modules/sequelize/lib/sql-string.js');
// FORUMS CRUD

// GET /Comments
exports.index = function (req, res, next) {
  models.CommentDB.findAll({
    }).then(
      function (CommentDB) {
        res.render('Comments/index', { title: 'Comments', Comments: CommentDB, errors: [] });
      }
    ).catch(function (error) {next(error);});
};

// GET /Comments
exports.create = function (req, res) {
  var CommentDB = models.CommentDB.build(
    { name: '', registeredAt: '', modifiedAt: '', detailCount: '', category: '' }
  );
  res.render('Comments/edit', { title: 'Registrar Foro', Comments: CommentDB, errors: [] });
};

// POST /Comments/
exports.store = function (req, res, next) {
  var CommentDB = models.CommentDB.build(req.body.CommentDB);

  CommentDB
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('Comments/edit', { title: 'Crear Comments', Comments: CommentDB, errors: err.errors });
      } else {
        CommentDB // save: guarda en DB campos
        .save({ fields: [
          'name', 'registeredAt', 'modifiedAt', 'detailCount', 'category'
        ] })
        .then(function () { res.redirect('/Comments'); });
      }
    }
  ).catch(function (error) { next(error); });
};

// GET /Comments/:id
// req.Comments: instancia de Comments cargada con autoload
exports.show = function (req, res) {
  res.render('Comments/show', { title: 'Comments', Comments: req.Comments, errors: [] });
};

// GET /Comments/:id/edit
// req.Comments: instancia de Comments cargada con autoload
exports.edit = function (req, res) {
  res.render('Comments/edit', { title: 'Editar Foro', Comments: req.Comments, errors: [] });
};

// PUT /Comments/:id
exports.update = function (req, res, next) {
  req.CommentDB.name = req.body.CommentDB.name;
  req.CommentDB.status = req.body.CommentDB.status;
  req.CommentDB.category = req.body.CommentDB.category;
  req.CommentDB.modifiedAt = new Date();

  req.CommentDB
  .validate()
  .then(
    function (err) {
      if (err) {
        res.render('Comments/' + req.body.CommentDB.id + '/edit',
          { title: 'Editar Comments', Comments: req.CommentDB, errors: err.errors });
      } else {
        req.CommentDB
        .save({ fields: [
          'name', 'status', 'modifiedAt', 'category'
        ] })
        .then(function () { res.redirect('/Comments'); });
      }
    }
  ).catch(function (error) { next(error); });
};

// DELETE /Comments/:id
// req.Comments: instancia de CommentDBs cargada con autoload
exports.destroy = function (req, res, next) {
  req.CommentDB.destroy().then(function () {
    res.redirect('/Comments');
  }).catch(function (error) { next(error); });
};

// FORUMS HELPERS

// MW que permite acciones solamente si el forum objeto pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function (req, res, next) {
  models.Topic.find( {
    where: {
      id: Number(req.CommentDB.TopicId)
    }
  } ).then(function (topic) {
    if (topic) {
      var objTopicOwner = topic.UserId;
      var logUser = req.session.user.id;
      var isAdmin = req.session.user.isAdmin;

      console.log(objTopicOwner, logUser, isAdmin);

      if (isAdmin || objTopicOwner === logUser) {
        next();
      } else {
        res.redirect('/');
      }
    } else {next(new Error('No existe topicId='));}
  }
  ).catch(function (error) { next(error); });
};

// Autoload :id de comentarios
exports.load = function (req, res, next, CommentDBId) {
  models.CommentDB.find({
    where: {
      id: Number(CommentDBId)
    }
  }).then(function (CommentDB) {
    if (CommentDB) {
      req.CommentDB = CommentDB;
      next();
    } else { next(new Error('No existe CommentDBId=' + CommentDBId)); }
  }
  ).catch(function (error) { next(error); });
};

// Autoload :id de comentarios
exports.loadPageId = function (req, res, next, pageId) {
  req.pageId = pageId;
  next();
};


// Post /search
exports.search = function (req, res, next) {
  res.locals.page = 1;
  res.locals.num = 1;
  res.locals.pages= 0; // not known yet

  models.CommentDB.findAndCountAll({
      where : ['Comment.texto like ?', '%' + req.body.searchText + '%'],
      include: [
        { model: models.User },
        {
          model: models.Topic, as: 'Topic',
          include: [models.User]
        }
      ],
      limit: res.locals.config.pagination.limit,
      sort: [['createdAt','desc']]
    }
  ).then(
      function (CommentDB) {
        res.locals.pages = Math.ceil(CommentDB.count/res.locals.config.pagination.limit);
        res.render('comments/search', {
          title: 'Search Comments',
          comments: CommentDB,
          searchText: req.body.searchText,
          errors: []
        });
      }
    ).catch(function (error) {next(error);});
};

// GET /search/page/:pageId
exports.searchPage = function (req, res, next, pageId) {
  console.log('searchPage');
  res.locals.page = pageId || 1;
  res.locals.num = res.locals.page * res.locals.config.limit;
  console.log('pageId ' + pageId);
  console.log('num ' + res.locals.num);
  models.CommentDB.findAndCountAll({
      where : ['Comment.texto like ?', '%' + req.body.searchText + '%'],
      include: [
        { model: models.User },
        {
          model: models.Topic, as: 'Topic',
          include: [models.User]
        }
      ],
      offset: res.locals.num,
      limit: res.locals.config.pagination.limit,
      sort: [['createdAt','desc']]
    }
  ).then(
      function (CommentDB) {
        res.locals.pages = Math.ceil(CommentDB.count/res.locals.config.pagination.limit);
        console.log(CommentDB.count);
        console.log(res.locals.pages);
        console.log(res.locals.page);
        console.log(res.locals.config.pagination.limit);
        console.log(Math.ceil(CommentDB.count/res.locals.config.pagination.limit));
        console.log(res.params);
        res.render('comments/searchPage', {
          title: 'Search Comments',
          comments: CommentDB,
          searchText: req.body.searchText,
          errors: []
        });
      }
    ).catch(function (error) {next(error);});
};
