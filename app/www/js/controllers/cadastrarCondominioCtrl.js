angular.module('app.cadastrarCondominioCtrl', [])

.controller('cadastrarCondominioCtrl', ['$scope', '$stateParams', '$http', 'CONST', 'Lista', '$window', '$cordovaGeolocation', '$cordovaSocialSharing', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, CONST, Lista, $window, $cordovaGeolocation, $cordovaSocialSharing) {

    // db.municipios.find({nomeMunicipio: /Monte carmelo/i})
    // db.municipios.find( { $and: [ { UF: /mg/i }, { nomeMunicipio: /Monte/i } ] } )

    var vm = this;

    vm.MSG = CONST.MSG;

    vm.uid = localStorage.getItem("uid");

    vm.dados = {};
    vm.ngif = {
        localizacao: true
    };

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        vm.la  = position.coords.latitude
        vm.lo = position.coords.longitude
        vm.dados.localizacao = vm.la + ", " + vm.lo;
    }, function(err) {
        console.log('>>> err: ', err);
        vm.ngif.localizacao = false;
    });

    // vm.keyPress = function(event){
    //     console.log('>>> event: ', event.srcElement.id); 
    //     if (event.keycode===13){

    //     } 
    // }

    // vm.nextFields = {
    //     "id.dados.nome"      : "id.dados.cep",
    //     "id.dados.cep"       : "id.dados.uf",
    //     "id.dados.uf"        : "id.dados.municipio",
    //     "id.dados.municipio" : "id.dados.endereco",
    //     "id.dados.endereco"  : "id.dados.confirma"
    // }

    // $scope.$watch("vm.event",function(evento){
    //     if (evento){
    //         var elem = document.getElementById(vm.nextFields[evento.srcElement.id]);
    //         console.log('>>> evento: ', evento);    
    //         console.log('>>> evento.srcElement.id: ', evento.srcElement.id); 
    //         console.log('>>> elem: ', elem); 
    //         elem.focus();
    //     }
    // });

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
    

    vm.buscaCEP = function(){
        if (vm.dados.cep && vm.dados.cep.length===10){

            var cep = vm.dados.cep.replace(/\./g, "");
                cep = cep.replace(/\-/g, "");

            console.log('>>> cep: ', cep); 

            $http.get('https://viacep.com.br/ws/'+cep+'/json/').then(

                function(success){
                    var endereco = [];
                    
                    if (success.data.logradouro)
                        endereco.push(success.data.logradouro);

                    if (success.data.bairro)
                        endereco.push(success.data.bairro);

                    if (success.data.complemento)
                        endereco.push(success.data.complemento);

                    if (endereco.length)
                        vm.dados.endereco = endereco.join(", ");

                    vm.selecionarMunicipio(
                        {
                            nomeMunicipio: success.data.localidade,
                            UF:            success.data.uf
                        }
                    );

                    console.log('>>> vm.dados.endereco: ', vm.dados.endereco); 

                    console.log('>>> CEP localizado: ', success); 
                },

                function(err){
                    console.log('>>> CEP não encontrado: ', err); 
                }

            );
        } else if(vm.dados.cep && vm.dados.cep.length){
            alert("CEP incorreto!");
        }
    }

    vm.submit = function(){
        console.log('>>> vm.dados: ', vm.dados); 
    }

    vm.salvar = function(){
        $http.put(CONST.REST.IP+'/altera/condominio/'+vm.condominio._id,vm.dados).then(
            
            function(success){
                console.log('>>> success: ', success);

                // abre o gerenciador de arquivos para envio do arquivo de moradores
                // com.sec.android.app.myfiles 
                // https://github.com/venkykowshik/startapp
                navigator.startApp.check("com.sec.android.app.myfiles", function(message) { /* success */
                    console.log('>>> app check message: ', message); 
                }, 
                function(error) { /* error */
                    console.log('>>> app check error: ', error); 
                });
            },

            function(err){
                console.log('>>> err: ', err); 
            }

        );
    };

    vm.selecionarMunicipio = function(municipio){
       
        if (municipio.naoSelecionar)
            return;

        vm.dados.municipio = municipio.nomeMunicipio
        vm.dados.UF        = municipio.UF;
        vm.municipios = [];
    }

    /**
     * @description busca município
     */
    // $scope.$watch("vm.dados.municipio",function(newValue,oldValue){

    vm.buscaMunicipio = function(){
        
        var newValue = vm.dados.municipio;

        if (newValue && vm.dados.UF.length < 2){
            
            document.getElementById('vm.dados.uf').focus();
            document.getElementById('id.dados.municipio').value = vm.dados.municipio = "";
            vm.municipios = [{
                UF: "",
                nomeMunicipio: "Informe a UF",
                naoSelecionar: true
            }];
            
        } else if (newValue && newValue.length > 4){
            // var params = newValue.split("(");
            //     params = params[1].split(")");

            var config = {"params":{
                UF:            vm.dados.UF,
                nomeMunicipio: vm.dados.municipio
                // UF:            params[0],
                // nomeMunicipio: params[1]
            }};

            $http.get(CONST.REST.IP+'/find/municipio',config).then(
                
                function(response){
                    if (response.data.length){
                        vm.municipios = response.data;
                    } else {
                        vm.municipios = [{
                            UF: "",
                            nomeMunicipio: "Município não localizado",
                            naoSelecionar: true
                        }];
                    }
                    console.log(">>> municipios: ",response);
                },

                function(err){
                    vm.municipios = [{
                        UF: "",
                        nomeMunicipio: "Município não localizado",
                        naoSelecionar: true
                    }];
                    console.log(">>> erro ao busar municipio: ",err);
                }
                
            );
        }

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
   
