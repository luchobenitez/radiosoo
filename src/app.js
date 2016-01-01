'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var compress = require('compression');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var moment = require('moment');
var passport = require('passport');
var flash    = require('express-flash');
var morgan   = require('morgan');
var config = require('./config/config');         // Get configuration file
var debug = require('debug');
var enforce = require('express-sslify');

var bunyan = require('bunyan');
var routes = require('./routes/index');
var csrf = require('csurf');
var helmet            = require('helmet');                  // https://github.com/evilpacket/helmet
var expressValidator  = require('express-validator');       // https://npmjs.org/package/express-validator

require('./config/passport')(passport);

var app = express();

var rslog = bunyan.createLogger({ name: 'RadioSo\'o Log' });

/**
 * Configuración y seteo de Express
 */

// Las variables locals son para la renderización de todos los templates
// dentro de la aplicación. Son utiles para proveer de funciones Helpers
// a los templates, así como datos globales a nivel del app

app.locals.application  = config.name;
app.locals.version      = config.version;
app.locals.description  = config.description;
app.locals.author       = config.author;
app.locals.keywords     = config.keywords;
app.locals.ga           = config.ga;

// Formato de fechas y horas para los templates
// Se puede utilizar moment en los templates ejs de esta forma:
// <%= moment(Date.now()).format('DD/MM/YYYY') %>
app.locals.moment = require('moment');

// Formato de numeros para los templates
// se puede utilizar en cualquier lugar del template ejs de esta forma:
// <%= numeral('12345').format('$0,0.00') %>
app.locals.numeral = require('numeral');
if (app.get('env') === 'development') {
  // No se minifica el html y se activa debug
  app.locals.pretty = true;
  app.locals.compileDebug = true;
  // se activa el log de la consola
  app.use(morgan('dev'));
  // se desactiva el caching
  // Setea la cabecera HTTP Cache-Control no-store, no-cache
  // con lo que el navegador no cachea nada.
  app.use(helmet.nocache());
}

if (app.get('env') === 'production') {
  // se minigica el html y se apaga el debug
  app.locals.pretty = false;
  app.locals.compileDebug = false;
  // Se habilita el proxy o el balanceador de carga (e.g. Heroku, Nodejitsu)
  app.enable('trust proxy', 1);  // trust first proxy

  // como la aplicación tiene registro, login, etc. los formularios deben server
  // protegidos con encripción SSL. Normalmente el endpoint es administrado por
  // el proxy por lo que no es necesario hacer poco. En producción se puede
  // redirigir todo el trafico SSL utilizando middleware
  //
  // todos los request HTTP no encriptado debe redireccionarse forzado de forma
  // automatica a la direccion HTTPS utilizando el 301 redirección permanente.
  // OJO con esto. el 301 es cacheado por los navegdores y suele ser
  // considerado permanente.
  //
  // NOTE: Utilizae `enforce.HTTPS(true)` si estamos detras de un proxy
  // que hace terminacion SSL
  app.use(enforce.HTTPS(true));
  // This tells browsers, "hey, only use HTTPS for the next period of time".
  // This will set the Strict Transport Security header, telling browsers to
  // visit by HTTPS for the next ninety days:
  // TODO: should we actually have this *and* app.use(enforce.HTTPS(true)); above?
  //       this seems more flexible rather than a hard redirect.
  var ninetyDaysInMilliseconds = 7776000000;
  app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds }));
  // Turn on HTTPS/SSL cookies
  config.session.proxy = true;
  config.session.cookie.secure = true;
}

// Port to listen on.
app.set('port', config.port);

// must be here previous to passport and views
app.use(favicon(__dirname + '/public/favicon.ico'));

// Report CSP violations (*ABOVE* CSURF in the middleware stack)
// Browsers will post violations to this route
// https://mathiasbynens.be/notes/csp-reports
app.post('/csp', bodyParser.json(), function (req, res) {
  // TODO - requires production level logging
  if (req.body) {
    // Just send to debug to see if this is working
    debug('CSP Violation: ' + JSON.stringify(req.body));
  } else {
    debug('CSP Violation: No data received!');
  }
  res.status(204).end();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Compress response data with gzip / deflate.
// This middleware should be placed "high" within
// the stack to ensure all responses are compressed.
app.use(compress());

// http://en.wikipedia.org/wiki/HTTP_ETag
// Google has a nice article about "strong" and "weak" caching.
// It's worth a quick read if you don't know what that means.
// https://developers.google.com/speed/docs/best-practices/caching
app.set('etag', true);  // other values 'weak', 'strong'

// Now setup serving static assets from /public

// time in milliseconds...
var minute = 1000 * 60;   //     60000
var hour = (minute * 60); //   3600000
var day  = (hour * 24);   //  86400000
var week = (day * 7);     // 604800000

app.use(express.static(__dirname + '/public', { maxAge: week }));

// Body parsing middleware supporting
// JSON, urlencoded, and multipart requests.
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Easy form validation!
// This line must be immediately after bodyParser!
app.use(expressValidator());

// If you want to simulate DELETE and PUT
// in your app you need methodOverride.
app.use(methodOverride());

// Use sessions
// NOTE: cookie-parser not needed with express-session > v1.5
app.use(session(config.session));

/*
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1); // trust first proxy
app.use(session(config.session));
*/

// Security Settings
app.disable('x-powered-by');          // Don't advertise our server type
app.use(csrf());                      // Prevent Cross-Site Request Forgery
app.use(helmet.nosniff());            // Sets X-Content-Type-Options to nosniff
app.use(helmet.ienoopen());           // X-Download-Options for IE8+
app.use(helmet.xssFilter());          // sets the X-XSS-Protection header
app.use(helmet.xframe('deny'));       // Prevent iframe
// app.use(helmet.crossdomain());        // crossdomain.xml

// Content Security Policy
//   http://content-security-policy.com/
//   http://www.html5rocks.com/en/tutorials/security/content-security-policy/
//   http://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/
app.use(helmet.contentSecurityPolicy({
  defaultSrc: [
    'self'
  ],
  scriptSrc: [
    'self',
    'unsafe-eval',
    'unsafe-inline',
    'ajax.googleapis.com',
    'www.google-analytics.com',
    'oss.maxcdn.com',
    'cdn.socket.io',
    'checkout.stripe.com'
  ],
  styleSrc: [
    'self',
    'unsafe-inline',
    'fonts.googleapis.com',
    'checkout.stripe.com'
  ],
  fontSrc: [
    'self',
    'fonts.googleapis.com',
    'themes.googleusercontent.com'
  ],
  imgSrc: [
    'self',
    'data:',
    'gravatar.com',
    'http://pbs.twimg.com',
    '*.4sqi.net',
    'avatars.githubusercontent.com',
    'http://*.media.tumblr.com',
    'http://userserve-ak.last.fm',
    'graph.facebook.com',
    '*.fbcdn.net',
    'fbcdn-profile-a.akamaihd.net',
    'github.global.ssl.fastly.net',
    'chart.googleapis.com',
    'www.google-analytics.com'
  ],
  mediaSrc: [
    'self'
  ],
  connectSrc: [ // limit the origins (via XHR, WebSockets, and EventSource)
    'self',
    'ws://localhost:3000',
    'wss://www.radiosoo.net',
    'api.github.com'
  ],
  objectSrc: [  // allows control over Flash and other plugins
    'none'
  ],

  frameSrc: [   // origins that can be embedded as frames
    'checkout.stripe.com'
  ],
  sandbox: [
    'allow-same-origin',
    'allow-forms',
    'allow-scripts'
  ],
  reportOnly: false,     // set to true if you *only* want to report errors
  setAllHeaders: false   // set to true if you want to set all headers
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Keep user, csrf token and config available
app.use(function (req, res, next) {
  res.locals.user = req.user;
  res.locals.config = config;
  res.locals._csrf = req.csrfToken();
  next();
});

app.use(flash());

/*
// app.use(methodOverride('_method'));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    // console.log(req.body);
    return method;
  }
}));
// Helpers dinamicos:
app.use(function (req, res, next) {

  // si no existe lo inicializa
  if (!req.session.redir) {
    req.session.redir = '/forum';
  }
  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout|\/user|\/topics|\/forum/)) {
    req.session.redir = req.path;
  }
  res.locals.user = req.user;
  res.locals.config = config;

  //*
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  // res.locals.user = req.user;
  // res.locals._csrf = req.csrfToken();


  //*
  res.locals.success = req.flash('success');
  res.locals.failure = req.flash('failure');
  res.locals.errores = req.flash('errores');

  rslog.info('res.locals.success: %s', res.locals.success);
  rslog.info('res.locals.failure: %s', res.locals.failure);
  rslog.info('res.locals.errores: %s', res.locals.errores);


  console.log('res.locals.config');
  console.log(res.locals.config.session);
  console.log(req);

  next();
});
*/
app.use(partials());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error ('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    // respond with html page
    if (err.status === 404) {
      res.render ('error/404', {
        title: 'fuera de la matrix',
        message: err.message,
        error: err,
        errors: []
      });
      return;
    } else {
      res.status(err.status || 500);
      console.log(500);
      res.render ('error/500', {
        title: 'errors development',
        message: err.message,
        error: err,
        errors: []
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render ('error', {
    title: 'errors production',
    message: err.message,
    error: {},
    errors: []
  });
});

module.exports = app;
