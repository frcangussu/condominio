var Condominio = require('../models/Condominio');

exports.list = function(callback){

	// pode-se colocar parametros de filtro
	Condominio.find({},function(error, dados){
		if (error){
			callback({error:'Não foi possível encontrar registros'});
		} else {
			console.log("condominios: ",dados);
			callback(dados);
		}
	});
}

exports.save = function(params,callback){
	
	new Condominio({
		'nome': params.nome,
		'endereco': params.endereco,
		'cep': params.cep,
		'telefone': params.telefone,
		'localizacao': params.localizacao
	}).save(function(error, condominio){
		if (error){
			callback({error:'Não foi possível salvar os dados do condomínio'});
		} else {
			callback(condominio);
		}
	});
};

exports.delete = function(id,callback){

	if (!id){
		callback({required:"ID não localizado"});
		return;
	}

	Condominio.findById(id,function(error, condominio){
		if (error){
			callback({error: 'Não foi possível excluir o condomínio'});
		} else {
			Condominio.remove({ _id: id }, function(error){
				if(!error){
					callback({resposta:"Condominio excluido com sucesso"});
				}
			})
		}
	})
}