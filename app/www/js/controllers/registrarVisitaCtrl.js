angular.module('app.registrarVisitaCtrl', [])

.controller('registrarVisitaCtrl', ['$scope', '$stateParams', '$state','$ionicPlatform', '$cordovaContacts',
function ($scope, $stateParams, $state, $ionicPlatform, $cordovaContacts) {

  var vm = this;
  vm.contatos = [
    {name: {givenName: 'Guilherme Dias'}, phoneNumbers: ['61 981489398']},
    {name: {givenName: 'Gustavo Dias'}, phoneNumbers: ['61 981489399']},
    {name: {givenName: 'Izabel Dias'}, phoneNumbers: ['61 981489397']},
    {name: {givenName: 'Edivaldo Dias'}, phoneNumbers: ['61 981489396']}
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
      // console.log(item.phoneNumbers[0]);
      var object = JSON.parse(localStorage.getItem(item.phoneNumbers[0])) || {};
      console.log('TESSSSSSSSSTTTTTTTTTTTTTTTT');
      console.log(object);
      if(object.status)
        item.status = object.status || 1;
      else
        item.status = 1;

    });
  }

  function action(contato) {
    $state.go('tabsController.pessoal', {contato: JSON.stringify(contato)});
  }

  vm.action = action;

}]);
