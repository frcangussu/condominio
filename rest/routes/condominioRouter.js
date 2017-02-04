var express = require('express');
var jwt = require('jsonwebtoken');
var router  = express.Router();
var condominioController = require('../controllers/condominioController');
var mainController = require('../controllers/mainController');


router.get('/',function(req,res){
	// mainController.list("Condominio",function(response){
	condominioController.list({"titulares":{"$elemMatch":{"telefone":'61994445455'}}}, function(response){
		res.json(response);
	});
});

router.post('/cadastra',function(req,res){
	var params = {};
	params.nome 		= req.body.nome;
	// params.descricao = req.body.descricao;
	// params.valor 	= req.body.valor;

	var Condominio = require('../models/Condominio');
	var item = new Condominio(params);

	condominioController.save(item,function(response){
		res.json(response);
	});
});

router.delete('/remove/:id',function(req,res){

	var id = req.params.id;

	mainController.delete("Condominio", id, function(response){
		res.json(response);
	});
});

router.put('/atualizar/teste', function (req,resp){


	// condominioController.update(
	// 	{"titulares":{"$elemMatch":{"telefone":req.body.telefone }}}, // query
	// 	{"nome": req.body.nome}, // objeto para salvar
	// 	 function (response){ // callback
	// 		 res.json(response);
	// 	 }
	// );

		// console.log('metodo atualizar');
		// console.log(req.body.nome);
		//
		// var data = new Date();
		// console.log(data.getDate());
		//
		var ticket = jwt.sign({nome: "Guilherme", telefone: '61994445455', tipo_visita: 1 }, 'samsung.a899ee4c.e48b6cf7ff12de19', {expiresIn: 60});
		resp.json({telefone_morador: "61991330123", ticket: ticket});
});

router.get('/validar/convite', function (req, resp){
	console.log(req.query.token);
	var token = req.query.token;
	jwt.verify(token, 'shhhhh', function(err, decoded) {
  	if (err) {
			console.log('token inválido.');
    /*
      err = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: 1408621000
      }
    */
	} else {
		console.log('token válido.');
		console.log(decoded);

	}

	});
});

router.put('/update/convidados', function (req,res){

	// Gera token
	var token = jwt.sign({ nome: req.body.nome, telefone: req.body.telefone }, 'shhhhh', {expiresIn: '1 day'});

	condominioController.update(
		{"titulares":{"$elemMatch":{"telefone":req.body.telefone }}}, // query
		{"nome": req.body.nome, "token": token}, // objeto para salvar
		 function (response){ // callback
			 res.json(response);
		 }
	);
});

module.exports = router;
