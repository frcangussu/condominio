angular.module('app.bemVindoAoAPPCtrl', ['ngMask'])

.controller('bemVindoAoAPPCtrl', ['$scope', '$stateParams', '$cordovaDevice', 'texto',
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaDevice, texto) {

    var vm = this;

    // e48b6cf7ff12de19
    // e48b6cf7ff12de19

    // var telefone = service.texto.extrair.numero(vm.telefone);

    vm.avancar = function(){
        $http.get('http://localhost:3000/rest/titulares/telefone/'+vm.telefone).then(
            function(response){
                console.log(response);
            }, 
            function(err){
                alert('Erro ao tentar localizar o usuário');
            }
        );
    }

    document.addEventListener("deviceready", function () {

        // http://localhost:3000/rest/titulares/telefone/61991330123

        var device = $cordovaDevice.getDevice();
        vm.uid = device.manufacturer+"."+device.serial+"."+device.uuid;

        console.log("vm.uid: ",vm.uid);

    }, false);
    
}])
