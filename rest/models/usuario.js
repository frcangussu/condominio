var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
	uid:        String,
	telefone:    String
});

module.exports = mongoose.model('Usuario',UsuarioSchema);