var express = require('express');
var router  = express.Router();
var mainController = require('../controllers/mainController');


router.get('/:controller/:campo/:valor',function(req,res){
		mainController.list(req.params,function(response){
		res.json(response);
	});
});

router.get('/:controller',function(req,res){
	mainController.list(req.params,function(response){
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

router.post('/cadastra/:controller',function(req,res){
	var controller   = req.params.controller;
	mainController.update(controller, req.body, function(response){
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