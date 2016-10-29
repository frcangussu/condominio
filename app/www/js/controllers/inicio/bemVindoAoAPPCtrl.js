angular.module('app.bemVindoAoAPPCtrl', ['ngMask'])

.controller('bemVindoAoAPPCtrl', ['$scope', '$stateParams', '$cordovaDevice', 'texto', '$state','$http',
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaDevice, texto, $state, $http) {

    var vm = this;

    // e48b6cf7ff12de19
    // e48b6cf7ff12de19

    // var telefone = service.texto.extrair.numero(vm.telefone);

    vm.avancar = function(){

        var telefone = texto.obterNumeros(vm.telefone);
        console.log(telefone);

        $http.get('http://localhost:3000/rest/titulares/telefone/'+telefone).then(
            function(response){
                var titular = response.data[0].titulares[0];
                if (!titular){
                    $state.go("selecioneOSeuPapel");
                } else {
                    $state.go("tabsController.registrarVisita");
                }
            }, 
            function(err){
                alert('Erro ao tentar localizar o usuário');
            }
        );

        // $state.go("selecioneOSeuPapel");
    }

    document.addEventListener("deviceready", function () {

        var device = $cordovaDevice.getDevice();
        vm.uid = device.manufacturer+"."+device.serial+"."+device.uuid;

    }, false);
    
}])
