var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PorteiroSchema = new Schema({
	id:Number,
	nome:String,
	telefone:String,
	senha:String
});

module.exports = mongoose.model('Porteiro',PorteiroSchema);