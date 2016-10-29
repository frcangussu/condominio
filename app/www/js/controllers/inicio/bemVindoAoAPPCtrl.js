angular.module('app.bemVindoAoAPPCtrl', ['ngMask'])

.controller('bemVindoAoAPPCtrl', ['$scope', '$stateParams', '$cordovaDevice',
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaDevice) {

    var vm = this;

    // e48b6cf7ff12de19
    // e48b6cf7ff12de19

    // vm.avancar = function(){
    //     service.http.getNumber(vm.telefone);
    // }

    // var telefone = service.texto.extrair.numero(vm.telefone);

    /**
     * extrair somente os numeros de uma string
     */
    var numberPattern = /\d+/g;
    'something102asdfkj1948948'.match( numberPattern )    

    document.addEventListener("deviceready", function () {

        var device = $cordovaDevice.getDevice();
        vm.uid = device.manufacturer+"."+device.serial+"."+device.uuid;

        console.log("vm.uid: ",vm.uid);

    }, false);
    
}])
