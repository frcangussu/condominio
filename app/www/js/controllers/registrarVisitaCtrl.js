angular.module('app.registrarVisitaCtrl', [])

.controller('registrarVisitaCtrl', ['$scope', '$http', '$stateParams', '$state','$ionicPlatform', '$cordovaContacts',
function ($scope, $http, $stateParams, $state, $ionicPlatform, $cordovaContacts) {

  var vm = this;
  vm.contatos = [
    {name: {givenName: 'Guilherme Dias'}, phoneNumbers: ['61981489398']},
    {name: {givenName: 'Gustav Dias'}, phoneNumbers: ['61981489']},
    {name: {givenName: 'Izabel Dias'}, phoneNumbers: ['61981489397']},
    {name: {givenName: 'Edivaldo Dias'}, phoneNumbers: ['61981489396']},
    {name: {givenName: 'Fernando'}, phoneNumbers: ['61991330123']}
  ];

//------------------------------------------------------------------------------

  // $ionicPlatform.ready(function() {
  //   $cordovaContacts.find({}).then(function (response){
  //     vm.contatos = response;
  //     verificaStatusConvite();
  //   });
  // });

//------------------------------------------------------------------------------

  verificaStatusConvite();

//------------------------------------------------------------------------------

  function verificaStatusConvite(){
    vm.contatos.forEach(function (item, index){
      // console.log(item.phoneNumbers[0]);
      var object = JSON.parse(localStorage.getItem(item.phoneNumbers[0])) || {};
      // console.log(object);
      item.status = object.status || 1;
    });
  }

  //------------------------------------------------------------------------------

  function action(contato) {
    $state.go('tabsController.pessoal', {contato: JSON.stringify(contato)});
  }

  //------------------------------------------------------------------------------

  vm.action = action;

}]);
