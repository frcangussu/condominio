angular.module('app.cadastrarCondominioCtrl', [])

.controller('cadastrarCondominioCtrl', ['$scope', '$stateParams', '$http', 'CONST', 'Lista', '$window', '$cordovaGeolocation', '$cordovaSocialSharing', '$cordovaFile', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, CONST, Lista, $window, $cordovaGeolocation, $cordovaSocialSharing, $cordovaFile) {

    console.log('>>> $cordovaFile: ', $cordovaFile); 

    var vm = this;

    vm.MSG = CONST.MSG;

    vm.uid = localStorage.getItem("uid");

    vm.dados = {};

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        vm.la  = position.coords.latitude
        vm.lo = position.coords.longitude
        vm.dados.localizacao = vm.la + ", " + vm.lo;
    }, function(err) {
        console.log('>>> err: ', err);
        vm.dados.localizacao = "localização não identificada";
    });

    if (vm.uid){
        // http://192.168.1.7:3000/rest/condominio/uid/samsung.a899ee4c.e48b6cf7ff12de19
        $http.get(CONST.REST.IP+'/condominio/uid/'+vm.uid).then(
            function(response){
                vm.condominio = response.data[0];
                vm.sindico = Lista.obterItem(vm.condominio.sindicos,"ativo",true);
                
                console.log(">>> condominio: ",vm.condominio);
                console.log(">>> sindico: ",vm.sindico);
            },
            function(err){}
        );
    }    

    vm.salvar = function(){
        $http.get(CONST.REST.IP+'/altera/condominio/'+vm.condominio._id,vm.dados).then(
            
            function(success){
                console.log('>>> success: ', success);

                // abre o gerenciador de arquivos para envio do arquivo de moradores
                // com.sec.android.app.myfiles 
                // https://github.com/venkykowshik/startapp
            },

            function(err){
                console.log('>>> err: ', err); 
            }

        );
    };

    /**
     * @description:  executa o click para o upload de arquivos
     */

    // document.getElementById('btnUpload').onclick = function(){
    //     document.getElementById('fileSelector').click();
    // };

    // $scope.$watch('vm.arquivo', function(newValue, oldValue) { 

    //     if (newValue){
    //         vm.fileUpload = newValue;

    //         console.log('>>> newValue: ', newValue); 

    //         // $cordovaFile.createFile(cordova.file.externalRootDirectory, "testeArquivo.xls", true)
    //         $cordovaFile.writeFile(cordova.file.externalRootDirectory, vm.fileUpload.file.name, encodeURIComponent(vm.fileUpload.result), true)
    //             .then(function (success) {
    //                 // success
    //                 console.log('>>> success: ', success);

    //                 var message = "Segue o arquivo de moradores ("+vm.fileUpload.file.name+")";
    //                 var subject = "Arquivo de Moradores";
    //                 var files   = "/storage/emulated/0/"+vm.fileUpload.file.name;
    //                 var link    = null;
    //                 $cordovaSocialSharing.share(message, subject, files, link) // Share via native share sheet
    //                     .then(function(result) {
    //                         alert("Arquivo enviado com sucesso");
    //                     }, function(err) {
    //                         vm.arquivo=null;
    //                         alert("erro ao tentar compartilhar");
    //                     // An error occured. Show a message to the user
    //                     });
    //             }, function (error) {
    //                 vm.arquivo=null;
    //                 console.log('>>> Erro ao gerar o arquivo: ', error); 
    //                 // error
    //             });

    //     }
        
    // });

   
}])
   
