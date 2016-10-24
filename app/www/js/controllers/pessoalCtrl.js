angular.module('app.pessoalCtrl', [])

.controller('pessoalCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

var vm = this;
vm.contato = JSON.parse($stateParams.contato);
// console.log(vm.contato);

}]);
