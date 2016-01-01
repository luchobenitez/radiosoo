'use strict';

var models = require('../models/models.js');

// GET /
exports.showHomePage = function (req, res) {
  res.render('index', { title: 'Home', errors: [], message: req.flash('error') });
};

// GET /terminos
exports.showTerms = function (req, res) {
  res.render('static/terminos', { title: 'Términos de Uso', errors: [], message: req.flash('error') });
};

// GET /about
exports.showAbout = function (req, res) {
  res.render('static/about', { title: 'About', errors: [], message: req.flash('error') });
};

// GET /privacidad
exports.showPrivacidad = function (req, res) {
  res.render('static/privacidad', { title: 'Términos de Privacidad', errors: [], message: req.flash('error') });
};

// GET /cookies
exports.showCookies = function (req, res) {
  res.render('static/cookies', { title: 'Uso de Cookies', errors: [], message: req.flash('error') });
};

// GET /historiasoo
exports.showHistoriaSoo = function (req, res) {
  res.render('static/historiasoo', { title: 'Nuestra Historia', errors: [], message: req.flash('error') });
};

// GET /donar
exports.showDonar = function (req, res) {
  res.render('static/donar', { title: 'Donar', errors: [], message: req.flash('error') });
};

// GET /sponsor
exports.showSponsor = function (req, res) {
  res.render('static/sponsor', { title: 'Sponsors', errors: [], message: req.flash('error') });
};
