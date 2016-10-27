var app = require('./config/app_config');
var db  = require('./config/db_config');
var Condomino = require("./models/Condominio")
var condominioController = require('./controllers/condominioController');
// var produto = require('./routes/produtoRouter');
// var condominio = require('./routes/condominioRouter');

// var Condomino = require('.models/Condomino');
var rest = require('./routes/restRouter');

// rotas
app.get('/',function(req,res){
	// res.json({nome:'Fernando'});
	res.end('Bem vindo à nossa Rest API');
});

app.get('/condominio',function(req,res){
	condominioController.list(function(resp){
		res.json(resp);
	});
});

app.post('/condominio/cadastro',function(req, res){
	
	condominioController.save(req.body,function(resp){
		res.json(resp);
	});

});

//rotas de produtos
// app.use('/produto',   produto);
// app.use('/condominio',condominio);
// app.use('/rest',rest);