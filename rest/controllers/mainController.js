var mongoose = require('mongoose');
var model    = require('../models/condominio');

exports.listCondominio = function(params,callback){

	var filtro = {};

	if (params.campo && params.valor){
		var campo = params.campo;
		filtro[campo] = { $regex: params.valor, $options: "i", $diacriticSensitive: false };
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

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

exports.listEntidade = function(entidade,params,callback){

	var filtro = {};

	var filtro = {};
	filtro[entidade] = 1;

	if (params.campo && params.valor){
		var campo = {}
		campo[params.campo] = params.valor;
		filtro[entidade] = {$elemMatch: campo};
	}

	model.find(
		{_id: mongoose.Types.ObjectId("5813f94f31b3412890527aae")},
		filtro,
		// {"titulares":{$elemMatch: {telefone: "61991330123"}}},
		function(error, dados){
			if (!error){
				callback({response:dados});
			} else {
				callback({erro:"Dados não localizados"});
			}
		}
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

