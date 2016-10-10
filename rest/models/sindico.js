var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SindicoSchema = new Schema({
	id:Number,
	nome:String,
	endereco:String,
	telefone:String,
	senha:String,
	morador:Boolean,
	inicio:String,
	fim:String,
	status:String
});

module.exports = mongoose.model('Sindico',SindicoSchema);