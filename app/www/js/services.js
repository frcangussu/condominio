angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('texto', [function(){


    /**
     * extrair somente os numeros de uma string
     */
    this.obterNumeros = function(valor){
        var numberPattern = /\d+/g;
        return valor.match( numberPattern ).join(""); 
    }

}]);