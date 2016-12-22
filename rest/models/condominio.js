var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CondominioSchema = new Schema({
	nome:        String,
	cep: 		 String,
	uf:			 String,
	municipio:	 String,
	endereco:    String,
	localizacao: String,
	telefone:  	 String,
	titulares:	 Array,
	sindicos:	 Array
});

module.exports = mongoose.model('Condominio',CondominioSchema);