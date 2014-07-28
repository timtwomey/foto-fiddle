var restify = require('restify'),
    db = require('./models'),
    images = require('./routes/images'),
    anchors = require('./routes/anchors'),
    settings, 
    server,
    API_BASE = '/api/v1';

server = restify.createServer({
  name: 'FotoFiddle',
});

// server.use(restify.CORS());
server.use(restify.bodyParser());
// server.use(restify.acceptParser(this.server.acceptable));
// server.use(restify.authorizationParser());
// server.use(restify.dateParser());
server.use(restify.queryParser());
// server.use(restify.conditionalRequest());
server.use(restify.multipartBodyParser());

server.get(API_BASE + '/images', images.all);
server.get(API_BASE + '/images/:id', images.one);
server.post(API_BASE + '/images', images.create);

server.post(API_BASE + '/anchors', anchors.create);


server.get(/\/media\/?.*/, restify.serveStatic({
  directory: '../../'
}));


db
  .sequelize
  .sync({ force: false })
  .complete(function(err) {
    if (err) {
      throw err[0]
    } else {
      server.listen(8080);
    }
  });

