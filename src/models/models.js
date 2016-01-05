'use strict';

var path = require('path');
var crypto = require('crypto');
var key = process.env.PASSWORD_ENCRYPTION_KEY;

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// MariaDB DATABASE_URL = mariadb://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var dbName  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(dbName, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);
// Importar definicion de la tabla Forum
var forumPath = path.join(__dirname,'forum');
var Forum = sequelize.import(forumPath);

// Importar definicion de la tabla Topic
var topicPath = path.join(__dirname,'topic');
var Topic = sequelize.import(topicPath);

// Importar definicion de la tabla CommentDBDB
var CommentDBPath = path.join(__dirname,'comment');
var CommentDB = sequelize.import(CommentDBPath);

// Importar definicion de la tabla User
var userPath = path.join(__dirname,'user');
var User = sequelize.import(userPath);

// Importar definicion de la tabla Session
var sessionPath = path.join(__dirname,'sessions');
var Session = sequelize.import(sessionPath);

// Importar definicion de la tabla UsersLogs
var userslogsPath = path.join(__dirname,'usersLogs');
var UsersLogs = sequelize.import(userslogsPath);

// Importar definicion de la tabla UsersChangeLogs
var usersChangeLogsPath = path.join(__dirname,'usersChangeLogs');
var UsersChangeLogs = sequelize.import(usersChangeLogsPath);

// Importar definicion de la tabla BanIP
var banIPPath = path.join(__dirname,'banIP');
var BanIP = sequelize.import(banIPPath);

// Importar definicion de la tabla BanEmail
var banEmailPath = path.join(__dirname,'banEmail');
var BanEmail = sequelize.import(banEmailPath);

// Importar definicion de la tabla BanLog
var banLogPath = path.join(__dirname,'banLogs');
var BanLog = sequelize.import(banLogPath);

// Importar definicion de la tabla BanLog
var beerpPath = path.join(__dirname,'beerps');
var Beerp = sequelize.import(beerpPath);

// Importar definicion de la tabla BeerpFolder
var beerpFolderPath = path.join(__dirname,'beerpsFolders');
var BeerpFolder = sequelize.import(beerpFolderPath);

// Importar definicion de la tabla Attribute
var attributePath = path.join(__dirname,'attributes');
var Attribute = sequelize.import(attributePath);

// Importar definicion de la tabla Preference
var preferencePath = path.join(__dirname,'preferences');
var Preference = sequelize.import(preferencePath);

// Importar definicion de la tabla UserIgnore
var userIgnorePath = path.join(__dirname,'userIgnore');
var UserIgnore = sequelize.import(userIgnorePath);

// Importar definicion de la tabla Moderator
var moderatorPath = path.join(__dirname,'moderators');
var Moderator = sequelize.import(moderatorPath);

// Importar definicion de la tabla ModeratorLog
var moderatorLogPath = path.join(__dirname,'moderatorsLogs');
var ModeratorLog = sequelize.import(moderatorLogPath);

// los topics pertenecen a un forum registrado
Topic.belongsTo(Forum);
Forum.hasMany(Topic);

// los CommentDBDB pertenecen a un Topic registrado
CommentDB.belongsTo(Topic);
Topic.hasMany(CommentDB);

// los topics pertenecen a un usuario registrado
Topic.belongsTo(User);
User.hasMany(Topic);

// los comentarios pertenecen a un usuario registrado
CommentDB.belongsTo(User);
User.hasMany(CommentDB);

// los sessions pertenecen a un users registrado
Session.belongsTo(User);
User.hasOne(Session);

// Los UsersLogs registran las actividades de los Usuarios
// con una session dada en un Foro dado.
UsersLogs.belongsTo(User);
User.hasMany(UsersLogs);
UsersLogs.belongsTo(Forum);
Forum.hasMany(UsersLogs);
UsersLogs.belongsTo(Session);
Session.hasMany(UsersLogs);

// Los Users ChangeLogs petenece a un User y Session
UsersChangeLogs.belongsTo(User);
User.hasMany(UsersChangeLogs);
UsersChangeLogs.belongsTo(Session);
Session.hasMany(UsersChangeLogs);

// los sessions pertenecen a un users registrado
UserIgnore.belongsTo(User);
User.hasMany(UserIgnore);

// los sessions pertenecen a un users registrado
BanIP.belongsTo(User);
User.hasMany(BanIP);

// los eMail pertenecen a un users registrado
BanEmail.belongsTo(User);
User.hasMany(BanEmail);

// los sessions pertenecen a un users registrado
BanLog.belongsTo(BanIP);
BanIP.hasMany(BanLog);

// los sessions pertenecen a un users registrado
BanLog.belongsTo(BanEmail);
BanEmail.hasMany(BanLog);

// los sessions pertenecen a un users registrado
Beerp.belongsTo(BeerpFolder);
BeerpFolder.hasMany(Beerp);

// Los Beerp son enviados por un Usuario a otro usuario
// relacion N:M
User.belongsToMany(User,
  {
    through: Beerp,
    foreignKey: 'fromUser',
    as: { singular: 'sendBeerp', plural: 'sendBeerps' }
  });
User.belongsToMany(User,
  {
    through: Beerp,
    foreignKey: 'toUser',
    as: { singular: 'recevBeerp', plural: 'recevBeerps' }
  });

// los sessions pertenecen a un users registrado
Preference.belongsTo(User);
User.hasMany(Preference);

// los sessions pertenecen a un users registrado
Preference.belongsTo(Attribute);
Attribute.hasMany(Preference);

// los sessions pertenecen a un users registrado
Moderator.belongsTo(User);
User.hasOne(Moderator);

// los sessions pertenecen a un users registrado
ModeratorLog.belongsTo(Moderator);
Moderator.hasOne(ModeratorLog);

console.log('sequelize init ALL');

Topic.hook('afterCreate', function (Topic, next) {
  console.log('afterCreate');
  this.associations.Forum.target.update({
      lastTopic: new Date(),
      topicCount: sequelize.literal('topicCount +1')
    })
    .then(function (forum) {
      console.lot('PRE Forum SAVE OK');
      return next(null, forum);
    })
    .catch(function (err) {
      console.lot('PRE Forum SAVE NOK');
      return next(null);
    });
});

// exportar tablas
exports.Forum = Forum;
exports.Topic = Topic;
exports.CommentDB = CommentDB;
exports.User = User;
exports.Session = Session;
exports.UsersLogs = UsersLogs;
exports.UsersChangeLogs = UsersChangeLogs;
exports.BanIP = BanIP;
exports.BanEmail = BanEmail;
exports.BanLog = BanLog;
exports.Beerp = Beerp;
exports.BeerpFolder = BeerpFolder;
exports.Attribute = Attribute;
exports.Preference = Preference;
exports.UserIgnore = UserIgnore;
exports.Moderator = Moderator;
exports.ModeratorLog = ModeratorLog;

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function () {
  console.log ('sequelize SYNC');
  // then(..) ejecuta el manejador una vez creada la tabla
  User.count().then(function (count) {
    if (count === 0) {   // la tabla se inicializa solo si está vacía
      User.bulkCreate(
        [
          { nick: 'webmonkey' ,username: 'webmonkey' ,name: 'Mono con Web',
            genre: 'F' ,email: 'webmonkey@radiosoo.net' ,dateOfBirth: '1997-07-16',
            dateOfDeath: '1997-07-16',
            password: crypto.createHmac('sha1', key).update('123').digest('hex'),
            isAdmin: true ,salt: 'hash2015' ,authToken: 'hash2015',
            lastLogin: '1997-07-16' ,lastSeen: '1997-07-16',
            lastPost: '1997-07-16' ,lastEmail: '1997-07-16' ,banAt: '1997-07-16',
            banTill: '1997-07-16'  ,banCount: 0 ,trustLevel: 1 ,avatarId: 1,
            msgCount: 1 ,logCount: 1 ,ipAddr: '0.0.0.0' ,status: 'A',
            iconId: 1 ,preferenceId: 1 ,location: '0' },
          { nick: 'pepito' ,username: 'pepito' ,name: 'pepito de la Web',
            genre: 'M' ,email: 'pepito@radiosoo.net' ,dateOfBirth: '1997-07-16',
            dateOfDeath: '1997-07-16',
            password: crypto.createHmac('sha1', key).update('123456').digest('hex'),
            isAdmin: false ,salt: 'hash2015' ,authToken: 'hash2015',
            lastLogin: '1997-07-16' ,lastSeen: '1997-07-16',
            lastPost: '1997-07-16' ,lastEmail: '1997-07-16' ,banAt: '1997-07-16',
            banTill: '1997-07-16' ,banCount: 0 ,trustLevel: 1 ,avatarId: 1,
            msgCount: 1 ,logCount: 1 ,ipAddr: '0.0.0.0' ,status: 'A',
            iconId: 1 ,preferenceId: 1 ,location: '0' }
        ]
      ).then(function () {
      console.log('Base de datos (tabla user) inicializada');
      Forum.count().then(function (count) {
        if (count === 0) {
          Forum.bulkCreate(
          [
            { name: 'Radio So\'o',
            description: 'Foro horizontal y anárquicamente organizado (?!! #$%&@),     \
            donde lo único que cuenta es tu cerebro. Entrá y opiná sobre cualquier     \
            tema de tu agrado (o no) y aportá vos tu pensamiento que habrá siempre un  \
            ánima virtual en pena impaciente de cambiar puntos de vista contigo        \
            (o mandarte a la #$%&@!!). El límite es tu imaginación, entrá y pasá un    \
            rato re-mbarete. ANOTATE como Soótizen y empezá a divertirte.Si todavía    \
            no entendíste, no importa entrá igual...',
            topicCount: 0, latestTopic: new Date(), postCount: 0, latestPost: new Date(),
            status: 'A', category: 0 },
            { name: 'El Ring',
            description: 'Foro anónimo, donde cada uno esta solo contra el mundo,      \
            restringido para menores de edad. Nadie te defenderá acá',
            topicCount: 0, latestTopic: new Date(), postCount: 0, latestPost: new Date(),
            status: 'A', category: 0 },
            ]
          ).then(function () {
            console.log('Base de datos (tabla forum) inicializada');
            Topic.count().then(function (count) {
              if (count === 0) {   // la tabla se inicializa solo si está vacía
                Topic.bulkCreate(
                  [
                    {
                      titulo: 'Titulo del post 0', texto: 'Este es el texto del post 0',
                      avatarid: 0, detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 1', texto: 'Este es el texto del post 1',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 2', texto: 'Este es el texto del post 2',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 3', texto: 'Este es el texto del post 3',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 4', texto: 'Este es el texto del post 4',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 5', texto: 'Este es el texto del post 5',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 6', texto: 'Este es el texto del post 6',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 7', texto: 'Este es el texto del post 7',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 8', texto: 'Este es el texto del post 8',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 9', texto: 'Este es el texto del post 9',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 10', texto: 'Este es el texto del post 10',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 11', texto: 'Este es el texto del post 11',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 12', texto: 'Este es el texto del post 12',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 13', texto: 'Este es el texto del post 13',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 14', texto: 'Este es el texto del post 14',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 15', texto: 'Este es el texto del post 15',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 16', texto: 'Este es el texto del post 16',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 17', texto: 'Este es el texto del post 17',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 18', texto: 'Este es el texto del post 18',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 1
                    },
                    {
                      titulo: 'Titulo del post 19', texto: 'Este es el texto del post 19',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 2
                    },
                    {
                      titulo: 'Titulo del post 20', texto: 'Este es el texto del post 20',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 1, ForumId: 2
                    },
                    {
                      titulo: 'Titulo del post 21', texto: 'Este es el texto del post 21',
                      avatarid: 0,detailCount: 0, status: 'A', category: 0,
                      pregunta: 'Capital de Italia', respuesta: 'Roma', UserId: 2, ForumId: 2
                    }
                  ]
                ).then(function () {
                  console.log('Base de datos (tabla topic) inicializada');
                  CommentDB.count().then(function (count) {
                    if (count === 0) {   // la tabla se inicializa solo si está vacía
                      CommentDB.bulkCreate(
                        [
                          { texto: 'Largo comentario de Comentario al post 1', status: 'A', TopicId: 1, UserId: 1 },
                          { texto: 'Largo comentario de Comentario1 al post 1', status: 'A', TopicId: 1, UserId: 1 },
                          { texto: 'Largo comentario de Comentario2 al post 2', status: 'A', TopicId: 2, UserId: 2 },
                          { texto: 'Largo comentario de Comentario3 al post 1', status: 'A', TopicId: 1, UserId: 2 },
                          { texto: 'Largo comentario de Comentario4 al post 2', status: 'A', TopicId: 2, UserId: 1 },
                          { texto: 'Largo comentario de Comentario5 al post 1', status: 'A', TopicId: 1, UserId: 1 },
                          { texto: 'Largo comentario de Comentario6 al post 2', status: 'A', TopicId: 2, UserId: 2 },
                          { texto: 'Largo comentario de Comentario7 al post 1', status: 'A', TopicId: 1, UserId: 2 },
                          { texto: 'Largo comentario de Comentario8 al post 2', status: 'A', TopicId: 2, UserId: 1 },
                          { texto: 'Largo comentario de Comentario9 al post 1', status: 'A', TopicId: 1, UserId: 1 },
                          { texto: 'Largo comentario de Comentario10 al post 2', status: 'A', TopicId: 2, UserId: 2 },
                          { texto: 'Largo comentario de Comentario11 al post 1', status: 'A', TopicId: 1, UserId: 2 },
                          { texto: 'Largo comentario de Comentario12 al post 2', status: 'A', TopicId: 2, UserId: 1 },
                          { texto: 'Largo comentario de Comentario13 al post 1', status: 'A', TopicId: 1, UserId: 2 },
                          { texto: 'Largo comentario de Comentario14 al post 2', status: 'A', TopicId: 2, UserId: 1 },
                          { texto: 'Largo comentario de Comentario15 al post 1', status: 'A', TopicId: 1, UserId: 1 },
                          { texto: 'Largo comentario de Comentario16 al post 2', status: 'A', TopicId: 2, UserId: 2 },
                          { texto: 'Largo comentario de Comentario17 al post 1', status: 'A', TopicId: 1, UserId: 2 },
                          { texto: 'Largo comentario de Comentario18 al post 2', status: 'A', TopicId: 2, UserId: 1 },
                          { texto: 'Largo comentario de Comentario19 al post 1', status: 'A', TopicId: 1, UserId: 1 },
                          { texto: 'Largo comentario de Comentario20 al post 3', status: 'A', TopicId: 3, UserId: 1 },
                          { texto: 'Largo comentario de Comentario21 al post 3', status: 'A', TopicId: 3, UserId: 1 },
                          { texto: 'Largo comentario de Comentario22 al post 4', status: 'A', TopicId: 4, UserId: 2 },
                          { texto: 'Largo comentario de Comentario23 al post 3', status: 'A', TopicId: 3, UserId: 2 },
                          { texto: 'Largo comentario de Comentario24 al post 4', status: 'A', TopicId: 4, UserId: 1 },
                          { texto: 'Largo comentario de Comentario25 al post 3', status: 'A', TopicId: 3, UserId: 1 },
                          { texto: 'Largo comentario de Comentario26 al post 4', status: 'A', TopicId: 4, UserId: 2 },
                          { texto: 'Largo comentario de Comentario27 al post 3', status: 'A', TopicId: 3, UserId: 2 },
                          { texto: 'Largo comentario de Comentario28 al post 4', status: 'A', TopicId: 4, UserId: 1 },
                          { texto: 'Largo comentario de Comentario29 al post 3', status: 'A', TopicId: 3, UserId: 1 }
                        ]
                      ).then(function () {
                        console.log('Base de datos (tabla CommentDB) inicializada');
                      });
                    }
                  }); // CommentDB.count
                });
              }
            }); // Topic.count()
          });
        }
      }); // Forum.count()
    });
    }
  }); // User.count()
  Session.count().then(function (count) {
    if (count === 0) {
      Session.bulkCreate(
      [
        { mode: 'A' },
        { mode: 'I' }
      ]
      ).then(function () {
        console.log('Base de datos (tabla Sessions) inicializada');
      });
    }
  });
});
