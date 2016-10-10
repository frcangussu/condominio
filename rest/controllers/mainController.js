exports.list = function(params,callback){

	var model = require('../models/'+params.controller);
	var filtro = {};

	if (params.campo && params.valor){
		var campo = params.campo;
		filtro[campo] = { $regex: params.valor, $options: "i" };
		console.log(filtro);
	}

	model.find(filtro,function(error, dados){
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
			callback({error: 'Não foi possível excluir o item'});
		} else {
			model.remove({ _id: id }, function(error){
				if(!error){
					callback({resposta:"Item excluído com sucesso"});
				}
			})
		}
	})
}

