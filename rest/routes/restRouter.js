var express = require('express');
var router  = express.Router();
var mainController = require('../controllers/mainController');

/**
 * @type: GET
 * @description: Realiza a busca por um documento de condominio
 * @argument: campo - nome do campo da collection condominio
 * @argument: valor - valor existente no campo informado
 * @returns: documento condominio
 */
router.get('/condominio/:campo/:valor',function(req,res){
		mainController.condominio.listar(req.params,function(response){
		res.json(response);
	});
});

/**
 * @description: Realiza a busca por um documento de uma collection (collectionName)
 * @argument: collectionName
 * @returns: lista de documentos
 */
router.get('/find/:collectionName',function(req,res){

	var filter = [];
	for (var key in req.query){
		
		// caso o objeto venha como string		
		var toParse = req.query[key];
		try {
			req.query[key] = JSON.parse(toParse);
		} catch (error) {
			req.query[key] = toParse;
		}

		var item = {}
		
		item[key] = new RegExp(req.query[key],"i"); //new RegExp("a|b", "i");
		
		if (req.query[key].type && req.query[key].value) {

			item[key] = new RegExp(req.query[key].value,"i");

			if (req.query[key].type == "number")
				item[key] = req.query[key].value;
		}

		filter.push(item);
	}

	mainController.get(req.params.collectionName,filter,function(response){
		res.json(response);
	});
	
});


/**
 * @type: GET
 * @description: recupera o condominio de baseado em um filtro de entidade
 * @argument: entidade - nome da entidade 
 * @argument: campo    - nome do campo da entidade
 * @argument: valor	   - valor existente no campo informado
 * @returns: documento condominio
 * @example: http://localhost:3000/condominio/porEntidade/titulares/telefone/61991330123
 */
router.get('/condominio/porEntidade/:entidade/:campo/:valor',function(req,res){
	mainController.condominio.listarPorEntidade(req.params,function(response){
		res.json(response);
	});
});


/**
 * @type: GET
 * @description: recupera um elemento (titular, sindico, etc.) de condominio de baseado em um filtro de entidade
 * @argument: entidade - nome da entidade 
 * @argument: campo    - nome do campo da entidade
 * @argument: valor	   - valor existente no campo informado
 * @returns: elemento
 */
router.get('/entidade/:entidade/:campo/:valor',function(req,res){
	mainController.condominio.listarEntidade(req.params,function(response){
		res.json(response);
	});
});


/**
 * @type: GET
 * @description: recupera um elemento (titular, sindico, etc.) de condominio de baseado em um filtro de entidade
 * @require: ObjectId do condominio
 * @argument: condominio - ObjectId do condominio 
 * @argument: entidade   - nome da entidade 
 * @argument: campo      - nome do campo da entidade
 * @argument: valor	     - valor existente no campo informado
 * @returns: elemento
 */
router.get('/condominio/:condominio/entidade/:entidade/:campo/:valor',function(req,res){
	mainController.condominio.listarEntidadeDeCondominio(req.params,function(response){
		res.json(response);
	});
});


/**
 * @type: PUT
 * @description: altera os dados de uma entidade (titular, sindico, et.)
 * @argument: condominio - ObjectId do condominio
 * @argument: entidade   - nome da entidade
 * @example: http://192.168.1.4:3000/rest/condominio/5813f94f31b3412890527aae/altera/titulares
 */
router.put('/condominio/:condominio/altera/:entidade',function(req,res){
	mainController.condominio.alterarEntidade(req.params,req.body,function(){
		res.json(response);
	});
});

/**
 * @type: PUT
 * @description: altera os dados de um documento de condominio
 * @argument: condominio - ObjectId do condominio
 * @example: http://192.168.43.197:3000/rest/condominio/583193cd0310930b00e2b053
 */
router.put('/altera/condominio/:condominio',function(req,res){
	
	mainController.update("condominio",req.params.condominio,req.body,function(response){
		res.json(response);
	});
});


/**
 * @type: POST
 * @description: insere um documento na collection de condominios já com o seu síndico 
 * @param: nome  - nome do sindico
 * @param: senha - senha do sindico
 * @param: foto  - foto do sindico em base64
 * @example: http://192.168.1.7:3000/rest/sindico/cadastra
 */
router.post('/sindico/cadastra',function(req,res){
	var params = {sindicos:[{
		nome: req.body.nome,
		senha: req.body.senha,
		foto: req.body.foto
	}]};

	mainController.save("condominio",params,function(response){
		res.json(response);
	});
});


/**
 * @type: POST
 * @description: insere um novo documento na collection de usuarios
 * @param: uid      - uid do dispositivo do usuário
 * @param: telefone - telefone do usuário
 */
router.post('/usuario/cadastra',function(req,res){
	
	var params = {
		uid: req.body.uid,
		telefone: req.body.telefone 
	};

	var filter = [
		{uid: req.body.uid},
		{telefone: req.body.telefone} 
	];

	mainController.get("usuario",filter,function(response){
		if (response.length){
			res.json({error: 'Cadastro não efetuado: Usuário já cadastrado'});
		} else {
			mainController.save("usuario",params,function(response){
				res.json(response);
			});	
		}
	});
	
});

/**
 * @type: POST
 * @description: insere um novo elemento (push) em uma entidade (titular, sindico, etc.)
 * @params: dados da entidade
 */
router.post('/cadastra/:entidade',function(req,res){
	var entidade   = req.params.entidade;
	mainController.condominio.cadastraEntidade(entidade, req.body, function(response){
		res.json(response);
	});
});



/**
 * @type: POST
 * @description: inserer um documento em uma collection qualquer
 * @params: collectionName
 * @example: http://192.168.43.197/cadastra/documento/municipios
 */
router.post('/cadastra/documento/:collectionName',function(req,res){
	mainController.save(req.params.collectionName, req.body, function(response){
		res.json(response);
	});
});

router.post('/adiciona/elemento/:collectionName/:documentId/:listName',function(req,res){

	mainController.push(
		req.params.collectionName, 
		req.params.documentId,
		req.params.listName,
		req.body,
		
		function(response){
			res.json(response);
		}
	);
});





module.exports = router;

// router.delete('/remove/:id',function(req,res){
	
// 	var id = req.params.id;

// 	mainController.delete("Produto", id, function(response){
// 		res.json(response);
// 	})
// });
// router.post('/:controller/cadastra',function(req,res){

// 	var Model = require('../models/'+req.params.controller);
// 	var item = new Model(req.body);

// 	mainController.save(item,function(response){
// 		res.json(response);
// 	});
// });

// route.get('/identifica/usuario/:telefone/:uid',function(){
	
// 	req.params.entidade = "titulares";

// 	req.params.filtro = {
// 		"telefone":req.params.telefone,
// 		"uid":req.params.uid 
// 	}

// 	mainController.listarEntidade(req.params,function(response){
// 		res.json(response);
// 	});
// });
