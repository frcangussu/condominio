angular.module('app.registrarVisitaCtrl', [])

.controller('registrarVisitaCtrl', ['$scope', '$stateParams', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
<<<<<<< HEAD
function ($scope, $stateParams, $state) {
    // $state.transitionTo("bemVindoAoAPP");
}])
   
=======
function ($scope, $stateParams) {
  console.log('teste');
  var vm = this;

  vm.contatos = [];

  function convidar(item) {
    
  }

}]);
>>>>>>> caa33fc60e16397b8af7b0f0aa6c3c7ca16cd913
