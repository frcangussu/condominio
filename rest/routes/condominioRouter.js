var express = require('express');
var router  = express.Router();
var condominioController = require('../controllers/condominioController');
var mainController = require('../controllers/mainController');


router.get('/',function(req,res){
	// mainController.list("Condominio",function(response){
	condominioController.list(function(response){
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
	})
});

module.exports = router;
