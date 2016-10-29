var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TitularSchema = new Schema({
	condominio:String,
	id:Number,
	nome:String,
	cpf:String,
	telefone:String,
	endereco:String,
	status:String
});

module.exports = mongoose.model('Titular',TitularSchema);