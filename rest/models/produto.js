var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProdutoSchema = new Schema({
	nome:String,
	descricao:String,
	valor:String,
	id: String
});

module.exports = mongoose.model('Produto',ProdutoSchema);
