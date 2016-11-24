angular.module('app.pessoalCtrl', [])

.controller('pessoalCtrl', ['$scope', '$stateParams', '$cordovaSocialSharing',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaSocialSharing) {

  var vm = this;
  vm.contato = JSON.parse($stateParams.contato);
  // console.log(vm.contato);
  vm.textoButtonAction = vm.contato.status == 2 ? 'Cancelar' : 'Confirmar';

  vm.shareAnywhere = function() {
    $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "https://www.thepolyglotdeveloper.com");
  };

}]);
