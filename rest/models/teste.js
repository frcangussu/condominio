var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TesteSchema = new Schema({
	nome:        String,
	valor: 		 Number
});

module.exports = mongoose.model('Teste',TesteSchema);