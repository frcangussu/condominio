var mongoose = require('mongoose');
var condominio    = require('../models/condominio');

exports.save = function(modelName,params,callback){

	console.log('>>> modelName: ', modelName); 
	console.log('>>> params: ', params); 

	var Model = require('../models/'+modelName);

	new Model(params).save(function(error, registro){
		if (error){
			callback({error:'Não foi possível salvar '+modelName});
		} else {
			callback(registro);
		}
	});
};

exports.update = function(modelName,documentId,params,callback){
	
	var model = require('../models/'+modelName);

	if (!documentId){
		callback({required:"ID não localizado"});
		return;
	}

	model.findById(documentId,function(error, documento){

		if (error){
			callback({error: 'Não foi possível alterar "'+modelName+'"'});
		} else {

			model.update(
				{_id: mongoose.Types.ObjectId(documentId) },
				{$set:params},
				function(error,sucesso){
					if(!error){
						if (sucesso.nModified)
							callback({info:modelName+" alterado com sucesso"});
						else
							callback({warn:"Não foi possível alterar "+modelName});
					} else {
						callback({erro: "Erro ao tentar alterar "+modelName});
					}
				}
			);

		}
	})

}

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

exports.get = function(modelName,filter,callback){

	var Model = require('../models/'+modelName);

	Model.find( {$and:filter} , function(error,response){
		if (error){
			callback({error: "Não foi possível recuperar os dados"});
		} else {
			callback(response);
		}
	});
};

/**
 * @description - Adicionar um elemento a um array da collection
 * @example     - ainda não foi testado
 */
exports.push = function(modelName, documentId, listName, dados, callback){
	
	var Model = require('../models/'+modelName);

	if (!documentId){
		callback({required:"Favor informar o _id de "+modelName});
		return;
	}

	var item = {};
	item[listName] = dados;
	
	Model.update(
		{_id: mongoose.Types.ObjectId(documentId) },
		{ $push: item },		
		function(error,sucesso){
			if(!error){
				if (sucesso.nModified)
					callback({info:listName+" cadastrado com sucesso"});
				else
					callback({warn:"Não foi possível cadastrar "+listName});
			} else {
				callback({erro: "Erro ao tentar inserir "+listName});
			}
		}
	)
};

/********************************************************************************************************** */
/********************************************************************************************************** */
/********************************************************************************************************** */

exports.condominio = {};

exports.condominio.listar = function(params,callback){

	var filtro = {};

	if (params.campo && params.valor){
		var campo = params.campo;
		// filtro[campo] = { $regex: params.valor, $options: "i", $diacriticSensitive: false };
		filtro[campo] = params.valor;
	}

	condominio.find(filtro,function(error, dados){
		console.log("model.find.filtro",filtro);	
		if (error){
			callback({error:'Não foi possível encontrar registros'});
		} else {
			callback(dados);
		}
	});
}

exports.condominio.listarPorEntidade = function(params,callback){
	
	var filtro = util.obterFiltro(params)

	condominio.find(
		filtro,
		function(error, dados){
			if (!error) { callback(dados); }
			else        { callback({erro:"Dados não localizados"}); }
		}
	);
}

exports.condominio.listarEntidade = function(params,callback){

	var filtro = {};

	filtro[0] = {};
	filtro[0][params.entidade+"."+params.campo] = params.valor;

	filtro[1] = util.obterFiltro(params);

	condominio.find(
		filtro[0],
		filtro[1],
		function(error, dados){
			if (!error){ callback(dados); } 
			else	   { callback({erro:"Dados não localizados"}); }
		}
	);
		
};

exports.condominio.listarEntidadeDeCondominio = function(params,callback){

	var filtro = util.obterFiltro(params);

	condominio.find(

		{_id: mongoose.Types.ObjectId(params.condominio)},
		filtro,
		function(error, dados){
			if (!error){ callback(dados); } 
			else	   { callback({erro:"Dados não localizados"}); }
		}
	);
		
};

exports.condominio.alterarEntidade = function(params,body,callback){

	var filtro = {};

	var dados  = body.dados;

	// prepara dados
	var dataSet = {};
	for (var campo in dados){
		dataSet[params.entidade+".$."+campo] = dados[campo];
	}

	filtro[params.entidade] = {$elemMatch : body.filtro};

	console.log('>>> filtro: ', filtro); 
	console.log('>>> dados: ', dados); 

	condominio.update(
		{ "_id" : mongoose.Types.ObjectId(params.condominio),
		  filtro // "titulares": { $elemMatch: { telefone: "61991330123" } }
		},
		{ $set: dataSet }
	);

}

exports.condominio.cadastraEntidade = function(entidade,dados,callback){

	if (!dados.condominio){
		callback({required:"Favor informar o condominio"});
		return;
	}

	var item = {};
	item[entidade] = dados;
	
	condominio.update(
		{_id: mongoose.Types.ObjectId(dados.condominio) },
		{ $push: item },		
		function(error,sucesso){
			if(!error){
				if (sucesso.nModified)
					callback({info:entidade+" cadastrado com sucesso"});
				else
					callback({warn:"Não foi possível cadastrar "+entidade});
			} else {
				callback({erro: "Erro ao tentar inserir "+entidade});
			}
		}
	)
};


///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

var util = {
	obterFiltro: function(params){
		
		var filtro = {};
		
		filtro[params.entidade] = 1;

		// {"titulares":{$elemMatch: {telefone: "61991330123"}}},
		if (params.campo && params.valor){
				var campo = {}
				campo[params.campo] = params.valor;
				filtro[params.entidade] = {$elemMatch: campo};
		}
		return filtro;
	}
};