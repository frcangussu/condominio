var app = require('./config/app_config');
var db  = require('./config/db_config');
var produto = require('./routes/produtoRouter');
var condominio = require('./routes/condominioRouter');

// var Condomino = require('.models/Condomino');
// var condominioController = require('./controllers/condominioController');
var rest = require('./routes/restRouter');

// rotas
app.get('/',function(req,res){
	// res.json({nome:'Fernando'});
	res.end('Bem vindo à nossa Rest API');
});

//rotas de produtos
app.use('/produto',   produto);
app.use('/condominio',condominio);
app.use('/rest',rest);