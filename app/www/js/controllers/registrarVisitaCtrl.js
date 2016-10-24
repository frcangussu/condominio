angular.module('app.registrarVisitaCtrl', [])

.controller('registrarVisitaCtrl', ['$scope', '$stateParams', '$state','$ionicPlatform', '$cordovaContacts',
function ($scope, $stateParams, $state, $ionicPlatform, $cordovaContacts) {

  var vm = this;

  vm.contatos = [];
  //   {name: {giveName: 'Guilherme Dias'}},
  //   {name: {giveName: 'Gustavo Dias'}},
  //   {name: {giveName: 'Izabel Dias'}},
  //   {name: {giveName: 'Edivaldo Dias'}}];

  $ionicPlatform.ready(function() {
    $cordovaContacts.find({}).then(function (response){
      vm.contatos = response;

    }, function (){

    });
  });

  function verificaStatusConvite(){

  }

  function action(contato) {
    $state.go('tabsController.pessoal', {contato: JSON.stringify(contato)});
  }

  vm.action = action;

}]);
