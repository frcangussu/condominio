angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('testeServico', [function(){
    this.get = function(){
        console.log(">>>> teste");
    }
}]);