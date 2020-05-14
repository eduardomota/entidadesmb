/*jshint esversion: 6 */

const aux = require('./auxiliary.js'),
  express = require('express'),
  bodyparser = require('body-parser');

const app = express();
var server = {};

app.use(express.static('public'));
app.use(bodyparser.urlencoded({
  extended: false
}));
app.use(express.json({
  type: ['application/json', 'text/plain']
}));

startup();

/*
  startup
    Starts up node server
 */
function startup() {
  server.port = 80; // Server port
  server.db = require('../dbs/db-current.json');  // Current server db
  server.entidades = {
    total: Object.keys(server.db).length,
    unique: aux.flatten(server.db).length,
  };
  app.listen(server.port, function() {
    console.log(`EntidadesMB running on port ${server.port}`);
  });
}

/*
  sanitizeEntidade
    Sanitizes Entidade field
 */
function sanitizeEntidade(entidade) {
  entidade = parseInt(entidade);
  if (entidade.length > 5 || entidade.length < 5 || isNaN(entidade) == true) {
    entidade = null;
  }
  return entidade;
}

/*
  /api/entidade
    Get registered entity name
 */
app.post('/api/entidade', function(req, res) {
  entidade = sanitizeEntidade(req.body.entidade);
  if (req.body.entidade in server.db) {
    console.log(`IP: ${req.connection.remoteAddress}, Entidade: ${entidade}, Nome: ${server.db[req.body.entidade].NAME}`);
    res.send(JSON.stringify({
      entidade: req.body.entidade,
      nome: server.db[req.body.entidade].NAME
    }));
  } else {
    console.log(`IP: ${req.connection.remoteAddress}, Entidade: ${entidade}, Nome: DESCONHECIDO`);
    res.send(JSON.stringify({
      entidade: req.body.entidade,
      nome: 'DESCONHECIDO'
    }));
  }
});

/*
  /api/stats
    Get database statistics
 */
app.get('/api/stats', function(req, res) {
  res.send(JSON.stringify({
    etotal: server.entidades.total,
    eunicas: server.entidades.unique
  }));
});

/*
  /api/stats/total
    Get total database registries
 */
app.get('/api/stats/total', function(req, res) {
  res.send(JSON.stringify({
    quantity: server.entidades.total
  }));
});

/*
  /api/stats/unique
    Get total unique database registries
 */
app.get('/api/stats/unique', function(req, res) {
  res.send(JSON.stringify({
    quantity: server.entidades.unique
  }));
});
