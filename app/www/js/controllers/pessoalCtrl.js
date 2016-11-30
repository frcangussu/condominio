angular.module('app.pessoalCtrl', [])

.controller('pessoalCtrl', ['$scope', '$stateParams', '$state', '$cordovaSocialSharing',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $cordovaSocialSharing) {

  var vm = this;
  vm.contato = JSON.parse($stateParams.contato);
  possuiApp();

  function possuiApp(){
    vm.contato.possuiApp = true;
  }

  vm.shareAnywhere = function() {
    $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "https://www.thepolyglotdeveloper.com");
  };

  vm.confirmar = function () {
    var dadosLocalStorage = JSON.parse(localStorage.getItem(vm.contato.phoneNumbers[0])) || {};
    dadosLocalStorage.status = 2;
    localStorage.setItem(vm.contato.phoneNumbers[0], JSON.stringify(dadosLocalStorage));
    $state.transitionTo('tabsController.registrarVisita', $stateParams, {reload: true,inherit: false,notify: true});
  };

  vm.cancelar = function(){
    var dadosLocalStorage = JSON.parse(localStorage.getItem(vm.contato.phoneNumbers[0])) || {};
    dadosLocalStorage.status = 1;
    localStorage.setItem(vm.contato.phoneNumbers[0], JSON.stringify(dadosLocalStorage));
    $state.transitionTo('tabsController.registrarVisita', $stateParams, {reload: true,inherit: false,notify: true});
    // $state.href('/registrarVisita');
  };

}]);
