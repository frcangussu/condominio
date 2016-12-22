var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoordenadaSchema = new Schema({
    codigo : Number,
    municipio : String,
    longitude : Number,
    latitude : Number
});

module.exports = mongoose.model('Coordenada',CoordenadaSchema);