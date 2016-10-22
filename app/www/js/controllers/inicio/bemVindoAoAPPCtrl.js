angular.module('app.bemVindoAoAPPCtrl', [])
  
.controller('bemVindoAoAPPCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    document.addEventListener("deviceready", onDeviceReady, false);
    
    function onDeviceReady() {
         window.plugins.sim.getSimInfo(successCallback, errorCallback);
    }
    
    function successCallback(result) {
        console.log(result);
    }
    
    function errorCallback(error) {
        console.log(error);
    }

}])
   