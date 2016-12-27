angular.module('app.cadastrarCondominioCtrl', [])

.controller('cadastrarCondominioCtrl', ['$scope', '$stateParams', '$http', 'CONST', 'Lista', '$window', '$cordovaGeolocation', '$cordovaSocialSharing', '$timeout', 'loading',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, CONST, Lista, $window, $cordovaGeolocation, $cordovaSocialSharing, $timeout, loading) {

    // db.municipios.find({nomeMunicipio: /Monte carmelo/i})
    // db.municipios.find( { $and: [ { UF: /mg/i }, { nomeMunicipio: /Monte/i } ] } )

    var vm = this;

    vm.MSG = CONST.MSG;

    vm.uid = localStorage.getItem("uid");

    vm.condominio = {};

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

        console.log(">>> passou buscaCEP");

        if (vm.condominio.cep && vm.condominio.cep.length===10){

            loading.show("Buscando Endereço...");

            var cep = vm.condominio.cep.replace(/\./g, "");
                cep = cep.replace(/\-/g, "");

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
                        vm.condominio.endereco = endereco.join(", ");

                    vm.pesquisarMunicipio( success.data.uf, success.data.localidade,
                        function(response){
                            console.log(">>> callback: buscaCEP.pesquisarMunicipio",response);
                            vm.selecionarMunicipio(response.data[0]);
                        }
                    );

                    loading.hide();
                },

                function(err){
                    loading.hide();
                    console.log('>>> CEP não encontrado: ', err); 
                }

            );
        } else if(vm.condominio.cep && vm.condominio.cep.length){
            alert("CEP incorreto!");
        }
    }

    vm.salvar = function(){
        
        loading.show('Salvando os Dados');
        $http.put(CONST.REST.IP+'/altera/condominio/'+vm.condominio._id,vm.condominio).then(
            
            function(success){
               loading.show('Dados salvos com sucesso',2000);
            },

            function(err){
                console.log('>>> err: ', err); 
            }

        );
    };

    vm.selecionarMunicipio = function(municipio){
       
        if (municipio.naoSelecionar)
            return;

        vm.condominio.codigoMunicipio = municipio.codigoMunicipioCompleto;
        vm.condominio.municipio       = municipio.nomeMunicipio;
        vm.condominio.uf              = municipio.UF;
        vm.municipios = [];
    };

    vm.buscaMunicipio = function(){
      
        // se o nome do Município está preenchido mas a UF não está
        if (vm.condominio.municipio && vm.condominio.uf && vm.condominio.uf.length < 2){
            
            document.getElementById('vm.condominio.uf').focus();
            document.getElementById('id.dados.municipio').value = vm.condominio.municipio = "";
            vm.municipios = [{
                UF: "",
                nomeMunicipio: "Informe a UF",
                naoSelecionar: true
            }];
        } 
        else if (vm.condominio.municipio && vm.condominio.municipio.length > 4)
        {
            vm.pesquisarMunicipio(vm.condominio.uf,vm.condominio.municipio,function(response){
                vm.municipios = response.data;
            });
        }

    };

    vm.pesquisarMunicipio = function(uf,municipio,callback){

        console.log(">>> passou pesquisarMunicipio");
        console.log('>>> uf: ', uf); 
        console.log('>>> municipio: ', municipio); 

        var config = {"params":{
            UF:            uf,
            nomeMunicipio: municipio
        }};

        $http.get(CONST.REST.IP+'/find/municipio',config).then(
            
            function(response){
                if (response.data.length){
                    vm.municipios = response.data;
                } else {
                    response.data = [{
                        UF: "",
                        nomeMunicipio: "Município não localizado",
                        naoSelecionar: true
                    }];
                }

                callback(response);
            },

            function(err){
                
                var response = {
                    data: [{
                        UF: "",
                        nomeMunicipio: "Município não localizado",
                        naoSelecionar: true
                    }]
                };

                callback(response);

                console.log(">>> erro ao busar municipio: ",err);
            }
            
        );        
    }

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
   
