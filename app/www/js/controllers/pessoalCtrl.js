angular.module('app.pessoalCtrl', [])

.controller('pessoalCtrl', ['$scope', '$http', '$stateParams', '$state', '$cordovaSocialSharing', '$ionicPopup', 'salvarDadosNaLocalEstorage', 'CONST',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $http, $stateParams, $state, $cordovaSocialSharing, $ionicPopup, salvarDadosNaLocalEstorage, CONST) {

  var vm = this;
  vm.contato = JSON.parse($stateParams.contato);
  vm.tipo_visita = 0;

  console.log(vm.contato);

//------------------------------------------------------------------------------

(function (){
    var dadosLocalStorage = JSON.parse(localStorage.getItem(vm.contato.phoneNumbers[0])) || {};
    vm.contato.possuiApp = dadosLocalStorage.possuiApp;
    if(!dadosLocalStorage.possuiApp){
      console.log('verificando se possui app');
      $http.get( CONST.REST.IP + '/entidade/titulares/telefone/'+ vm.contato.phoneNumbers[0])
      .success(function(response){
        console.log(response);
        vm.contato.possuiApp = response.length > 0;
        salvarDadosNaLocalEstorage(vm.contato.phoneNumbers[0], 'possuiApp', response.length > 0);
      });
    }
})();

//------------------------------------------------------------------------------

  vm.shareAnywhere = function() {
    console.log('não esta cadastrado');
    // $cordovaSocialSharing.share("This is your message", "This is your subject", "www/imagefile.png", "https://www.thepolyglotdeveloper.com");
  };

//------------------------------------------------------------------------------

  vm.confirmar = function () {
    var params = {
      nome_visitante: vm.contato.name.givenName,
      telefone_visitante: vm.contato.phoneNumbers[0],
      tipo_visita: vm.tipo_visita,
      nome_morador: localStorage.getItem('nome'),
      telefone_morador: localStorage.getItem('telefone'),
      uid: localStorage.getItem('uid')
    };

    console.log(params);
    console.log(CONST.REST.IP);

    $http.post(CONST.REST.IP + '/convite/enviar', params)
    .success(function (response){
      console.log(response);
      console.log('Enviando convite para:', vm.contato.phoneNumbers[0]);
      salvarDadosNaLocalEstorage(vm.contato.phoneNumbers[0], 'status', 2);
      $state.transitionTo('tabsController.registrarVisita', $stateParams);
    }).error(function (response){
      console.log(response);
    });
  };

//------------------------------------------------------------------------------

  vm.cancelar = function(){

    var confirma  = $ionicPopup.confirm(
      {
        title: 'Cancelar Convite',
        template: 'Deseja cancelar este convite?',
        okText: 'Sim'
      }
    );

    confirma.then(function(resp){
      console.log(resp);
      if(resp){
        console.log(vm.contato.phoneNumbers[0]);
        console.log(localStorage.getItem('telefone'));
        $http.delete(CONST.REST.IP + '/convite/cancelar', {params:{telefone_visitante: vm.contato.phoneNumbers[0], telefone_morador: localStorage.getItem('telefone')}})
        .success(function (response){
          console.log('Deu certo >>>>> ',response);
          salvarDadosNaLocalEstorage(vm.contato.phoneNumbers[0], 'status', 1);
          $state.transitionTo('tabsController.registrarVisita', $stateParams, {reload: true,inherit: false,notify: true});
        }).error(function (response){
          console.log('Não deu certo >>>>> ',response);
          console.log(response);
        });

      }
    });

    // $state.href('/registrarVisita');
  };

}]);
