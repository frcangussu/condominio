var mongoose = require('mongoose');
var model    = require('../models/condominio');

exports.listCondominio = function(params,callback){

	var filtro = {};

	if (params.campo && params.valor){
		var campo = params.campo;
		// filtro[campo] = { $regex: params.valor, $options: "i", $diacriticSensitive: false };
		filtro[campo] = params.valor;
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

exports.save = function(modelName,params,callback){

	var Model = require('../models/'+modelName);

	new Model(params)
	.save(function(error, registro){
		if (error){
			callback({error:'Não foi possível salvar '+modelName});
		} else {
			callback(registro);
		}
	});
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
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
exports.listarCondominioPorEntidade = function(params,callback){
	
	var filtro = util.obterFiltro(params)

	model.find(
		filtro,
		function(error, dados){
			if (!error) { callback(dados); }
			else        { callback({erro:"Dados não localizados"}); }
		}
	);
}

exports.listarEntidade = function(params,callback){

	var filtro = {};

	filtro[0] = {};
	filtro[0][params.entidade+"."+params.campo] = params.valor;

	filtro[1] = util.obterFiltro(params);

	model.find(
		filtro[0],
		filtro[1],
		function(error, dados){
			if (!error){ callback(dados); } 
			else	   { callback({erro:"Dados não localizados"}); }
		}
	);
		
};

exports.listarEntidadePorCondominio = function(params,callback){

	var filtro = util.obterFiltro(params);

	model.find(

		{_id: mongoose.Types.ObjectId(params.condominio)},
		filtro,
		function(error, dados){
			if (!error){ callback(dados); } 
			else	   { callback({erro:"Dados não localizados"}); }
		}
	);
		
};

exports.alterarEntidade = function(params,body,callback){

	var filtro = {};

	var dados  = body.dados;

	// prepara dados
	var dataSet = {};
	for (var campo in dados){
		dataSet[params.entidade+".$."+campo] = dados[campo];
	}

	filtro[params.entidade] = {$elemMatch : body.filtro};

	model.update(
		{ "_id" : mongoose.Types.ObjectId(params.condominio),
		  filtro // "titulares": { $elemMatch: { telefone: "61991330123" } }
		},
		{ $set: dataSet }
	);

}

exports.insert = function(entidade,dados,callback){

	if (!dados.condominio){
		callback({required:"Favor informar o condominio"});
		return;
	}

	var item = {};
	item[entidade] = dados;
	
	model.update(
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

