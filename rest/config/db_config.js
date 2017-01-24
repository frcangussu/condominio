var mongoose = require('mongoose');

// var urlString = 'mongodb://localhost/API';
var urlString = 'mongodb://localhost/SINDICO';
// var urlString = 'mongodb://localhost/visitacao';

mongoose.connect(urlString,function(err,res){
	if (err){
		console.log("Não foi possível conectar a: "+urlString);
	} else {
		console.log("Conectado  a "+urlString);
	}
});