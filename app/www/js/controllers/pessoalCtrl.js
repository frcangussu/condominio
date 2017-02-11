angular.module('app.pessoalCtrl', [])

.controller('pessoalCtrl', ['$scope', '$http', '$stateParams', '$state', '$cordovaSocialSharing',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, $state, $cordovaSocialSharing) {

  var vm = this;
  vm.contato = JSON.parse($stateParams.contato);
  vm.isProfissional = 0;

  console.log('Tela Pessoal');
  console.log(vm.contato);

//------------------------------------------------------------------------------

  $http.get('http://localhost:3000/api/rest/entidade/titulares/telefone/'+ vm.contato.phoneNumbers[0])
  .success(function(response){
    console.log(response);
    vm.contato.possuiApp = response.length > 0;
  });

//------------------------------------------------------------------------------

  vm.shareAnywhere = function() {
    console.log('não esta cadastrado');
    // $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "https://www.thepolyglotdeveloper.com");
  };

//------------------------------------------------------------------------------

  vm.confirmar = function () {
     // LOCALSTORAGE
    var dadosLocalStorage = JSON.parse(localStorage.getItem(vm.contato.phoneNumbers[0])) || {};
    dadosLocalStorage.status = 2;
    localStorage.setItem(vm.contato.phoneNumbers[0], JSON.stringify(dadosLocalStorage));

    // DB
    console.log(vm.contato);

    $state.transitionTo('tabsController.registrarVisita', $stateParams);
  };

//------------------------------------------------------------------------------

  vm.cancelar = function(){
    var dadosLocalStorage = JSON.parse(localStorage.getItem(vm.contato.phoneNumbers[0])) || {};
    dadosLocalStorage.status = 1;
    localStorage.setItem(vm.contato.phoneNumbers[0], JSON.stringify(dadosLocalStorage));
    $state.transitionTo('tabsController.registrarVisita', $stateParams, {reload: true,inherit: false,notify: true});
    // $state.href('/registrarVisita');
  };

}]);
