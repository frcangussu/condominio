var Produto = require('../models/Produto');

//permite chamada a um metodo de outro arquivo
exports.save = function(params,callback){
	
	new Produto({
		'nome': params.nome,
		'descricao': params.descricao,
		'valor': params.valor
	}).save(function(error, produto){
		if (error){
			callback({error:'Não foi possível salvar'});
		} else {
			callback(produto);
		}
	});
};

exports.list = function(callback){
	Produto.find({},function(error, produto){
		if (error){
			callback({error: "Não foi possível localizar produtos"});
		} else {
			callback(produto);
		}
	});
}