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

}]);