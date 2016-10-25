angular.module('app.bemVindoAoAPPCtrl', [])

.controller('bemVindoAoAPPCtrl', ['$scope', '$stateParams', '$cordovaDevice',
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cordovaDevice) {

    var vm = this;

    // e48b6cf7ff12de19
    // e48b6cf7ff12de19

    document.addEventListener("deviceready", function () {

        var device = $cordovaDevice.getDevice();
        vm.uid = device.manufacturer+"."+device.serial+"."+device.uuid;

        console.log("vm.uid: ",vm.uid);

    }, false);
    
}])
