var app = require('./config/app_config');
var db  = require('./config/db_config');
// var Condomino = require("./models/Condominio")
// var condominioController = require('./controllers/condominioController');
// var produto = require('./routes/produtoRouter');
// var condominio = require('./routes/condominioRouter');
// var Condomino = require('.models/Condomino');

var rest = require('./routes/restRouter');

/**
 * definição das rotas
 */
// app.use('/condominio',condominio);
// app.use('/produto',   produto);
app.use('/rest',rest);