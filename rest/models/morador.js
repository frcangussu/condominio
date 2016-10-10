var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MoradorSchema = new Schema({
	id:Number,
	nome:String,
	cpf:String,
	telefone:String,
	endereco:String,
	status:String
});

module.exports = mongoose.model('Morador',MoradorSchema);