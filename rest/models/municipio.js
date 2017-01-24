var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MunicipioSchema = new Schema({
	codigoUF:                Number,
    UF:                      String,
    nomeUF:                  String,
    codigoMesorregiao:       Number,
    nomeMesorregiao:         String,
    codigoMicrorregiao:      Number,
    nomeMicrorregiao:        String,
    codigoMunicipio:         Number,
    codigoMunicipioCompleto: Number,
    nomeMunicipio:           String
});

module.exports = mongoose.model('Municipio',MunicipioSchema);