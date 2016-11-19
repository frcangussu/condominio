angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('texto', [function(){

    /**
     * extrair somente os numeros de uma string
     */
    this.obterNumero = function(valor){
        var numberPattern = /\d+/g;
        return valor.match( numberPattern ).join(""); 
    }

}])

.service('array',[function(){

    /**
     * Localiza e retorna um elemento do array
     */
    this.obterItem = function(lista,campo,valor){
        return lista.find( function (item) {
    	    return item["campo"] == "valor";
		} );
    }

}]);