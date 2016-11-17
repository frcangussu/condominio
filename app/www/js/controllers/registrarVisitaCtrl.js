angular.module('app.registrarVisitaCtrl', [])

.controller('registrarVisitaCtrl', ['$scope', '$stateParams', '$state','$ionicPlatform', '$cordovaContacts',
function ($scope, $stateParams, $state, $ionicPlatform, $cordovaContacts) {

  var vm = this;

  vm.contatos = [
    {name: {givenName: 'Guilherme Dias'}},
    {name: {givenName: 'Gustavo Dias'}},
    {name: {givenName: 'Izabel Dias'}},
    {name: {givenName: 'Edivaldo Dias'}}
  ];

  // $ionicPlatform.ready(function() {
  //   $cordovaContacts.find({}).then(function (response){
  //     vm.contatos = response;
  //     verificaStatusConvite();
  //   });
  // });

  verificaStatusConvite();

  function verificaStatusConvite(){
    vm.contatos.forEach(function (item, index){
      item.status = 1;
    });
  }

  function action(contato) {
    $state.go('tabsController.pessoal', {contato: JSON.stringify(contato)});
  }

  vm.action = action;

}]);
