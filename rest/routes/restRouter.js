var express = require('express');
var router  = express.Router();
var mainController = require('../controllers/mainController');

/**
 * Rotas para o documento principal
 */
router.get('/condominio/:campo/:valor',function(req,res){
		mainController.listCondominio(req.params,function(response){
		res.json(response);
	});
});


router.post('/:controller/cadastra',function(req,res){

	var Model = require('../models/'+req.params.controller);
	var item = new Model(req.body);

	mainController.save(item,function(response){
		res.json(response);
	});
});


/**
 * Rotas para os elementos do documento principal
 */
router.get('/:entidade',function(req,res){
	var entidade = req.params.entidade;
	mainController.listEntidade(entidade,null,function(response){
		res.json(response);
	});
});

router.get('/:entidade/:campo/:valor',function(req,res){
	var entidade = req.params.entidade;
	mainController.listEntidade(entidade,req.params,function(response){
		res.json(response);
	});
});

router.post('/cadastra/:entidade',function(req,res){
	var entidade   = req.params.entidade;
	mainController.insert(entidade, req.body, function(response){
		res.json(response);
	});
});

router.delete('/remove/:id',function(req,res){
	
	var id = req.params.id;

	mainController.delete("Produto", id, function(response){
		res.json(response);
	})
});

module.exports = router;