var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CondominioSchema = new Schema({
	nome:        String,
	endereco:    String,
	telefone:  	 String,
	cep: 		 String,
	localizacao: String,
	titulares:	 Array,
	sindicos:	 Array
});

module.exports = mongoose.model('Condominio',CondominioSchema);