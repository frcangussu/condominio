angular.module('app.cadastrarCondominioCtrl', [])

.controller('cadastrarCondominioCtrl', ['$scope', '$stateParams', '$http', 'PARAMS', 'Lista', '$window', '$cordovaGeolocation', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, PARAMS, Lista, $window, $cordovaGeolocation) {

    var vm = this;

    vm.uid = localStorage.getItem("uid");

    // executa o click para o upload de arquivos
    document.getElementById('btnUpload').onclick = function(){
        document.getElementById('fileSelector').click();
    };


    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
        .getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude
            var long = position.coords.longitude
        }, function(err) {
            alert("erro ao tentar recuperar localização");
        });


    if (vm.uid){
        // http://192.168.1.7:3000/rest/condominio/uid/samsung.a899ee4c.e48b6cf7ff12de19
        $http.get(PARAMS.REST.IP+'/condominio/uid/'+vm.uid).then(
            function(response){
                vm.condominio = response.data[0];
                console.log(">>> condominio: ",vm.condominio);
                console.log(">>> sindicos:",vm.condominio.sindicos);
                vm.sindico = Lista.obterItem(vm.condominio.sindicos,"ativo",true);
                console.log(">>> sindico: ",vm.sindico);
            },
            function(err){}
        );
    }
}])
   
