angular.module('app.registrarVisitaCtrl', [])

.controller('registrarVisitaCtrl', ['$scope', '$stateParams', '$state',
function ($scope, $stateParams, $state) {

  var vm = this;

  vm.contatos = [
    {name: {giveName: 'Guilherme Dias'}},
    {name: {giveName: 'Gustavo Dias'}},
    {name: {giveName: 'Izabel Dias'}},
    {name: {giveName: 'Edivaldo Dias'}}];

  function action(contato) {
    console.log(contato);
    $state.go('tabsController.pessoal', {contato: JSON.stringify(contato)});
  }

  vm.action = action;

}]);
