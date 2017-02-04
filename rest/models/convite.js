var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conviteSchema = new Schema({
  telefone: String,
  tipoVisita: Number
});

module.exports =  mongoose.model('Convite', conviteSchema);
