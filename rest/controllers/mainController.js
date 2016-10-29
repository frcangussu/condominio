var mongoose = require('mongoose');

exports.list = function(params,callback){

	var model = require('../models/'+params.controller);
	var filtro = {};


	if (params.campo && params.valor){
		var campo = params.campo;
		filtro[campo] = { $regex: params.valor, $options: "i" }; //, $diacriticSensitive: false };
	}

	model.find(filtro,function(error, dados){
		console.log("model.find.filtro",filtro);	
		if (error){
			callback({error:'Não foi possível encontrar registros'});
		} else {
			callback(dados);
		}
	});
}

exports.save = function(item,callback){

	item.save(function(error, registro){
		if (error){
			callback({error:'Não foi possível salvar'});
		} else {
			callback(registro);
		}
	});
};

exports.update = function(controller,dados,callback){

	var model = require('../models/condominio');

	if (!dados.condominio){
		callback({required:"ID não localizado"});
		return;
	}

	console.log(controller);

	model.findById(dados.condominio,function(error, dados){
		if (error){
			callback({error: 'Não foi possível localizar o registro'});
		} else {
			model.update(
				{_id: mongoose.Types.ObjectId("5813f94f31b3412890527aae") },
				{ $addToSet: { "titulares" : dados} },		
				function(error){
					console.log(error);
					if(!error){
						callback({resposta:controller+" cadastrado com sucesso"});
					}
				}
			)
		}
	})

	// item.update(
	// 	{_id:ObjectId(idCondominio)},
	// 	{ 
	// 		$addToSet: { sindicos: {
	// 			nome: "José da Silva",
	// 			endereco: "Rua C, casa 20",
	// 			telefone: "(61)3434-3434",
	// 			senha: "********",
	// 			morador: true,
	// 			inicio : "08/10/2016",
	// 			fim: null
	// 		}} 
	// 	}		
	// 	function(error, registro){
	// 	if (error){
	// 		callback({error:'Não foi possível salvar'});
	// 	} else {
	// 		callback(registro);
	// 	}
	// });
};


exports.delete = function(modelName,id,callback){

	var model = require('../models/'+modelName);

	if (!id){
		callback({required:"ID não localizado"});
		return;
	}

	model.findById(id,function(error, dados){
		if (error){
			callback({error: 'Não foi possível excluir o '+modelName});
		} else {
			model.remove({ _id: id }, function(error){
				if(!error){
					callback({resposta:modelName+" excluído com sucesso"});
				}
			})
		}
	})
}

