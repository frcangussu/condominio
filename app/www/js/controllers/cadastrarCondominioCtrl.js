angular.module('app.cadastrarCondominioCtrl', [])

.controller('cadastrarCondominioCtrl', ['$scope', '$state', '$http', 'CONST', 'Lista', '$window', '$cordovaGeolocation', '$cordovaSocialSharing', '$timeout', 'message', '$ionicPopup', 'uid',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $state.parameterName
function ($scope, $state, $http, CONST, Lista, $window, $cordovaGeolocation, $cordovaSocialSharing, $timeout, message, $ionicPopup) {

    // db.municipios.find({nomeMunicipio: /Monte carmelo/i})
    // db.municipios.find( { $and: [ { UF: /mg/i }, { nomeMunicipio: /Monte/i } ] } )

    var vm = this;

    vm.MSG = CONST.MSG;

    vm.uid = localStorage.getItem("uid");

    vm.condominio = {};

    // busca dados iniciais
    if (vm.uid){
        // $http.get(CONST.REST.IP+'/condominio/uid/'+vm.uid).then(
        $http.get(CONST.REST.IP+'/condominio/porEntidade/sindicos/uid/'+vm.uid).then(function(response){
                vm.condominio = response.data[0];
                vm.sindico = Lista.obterItem(vm.condominio.sindicos,"ativo",true);
                
                console.log(">>> condominio: ",vm.condominio);
                console.log(">>> sindico: ",vm.sindico);
            },
            function(err){}
        );
    }

    vm.alert = function(msg, title, foco, callback){
        var alerta = $ionicPopup.alert({
            title: title || "Alerta",
            template: msg,
            okText: "OK"
        });

        alerta.then(function(){
            
            if(foco || vm.focoId)
                vm.foco(foco || vm.focoId,100);
            
            if(callback)
                callback();
        });
    };

    vm.foco = function(id,time){
        vm.focoId = id;
        $timeout(function(){
            try {
                var campo = document.getElementById(id);
                campo.focus();
            } catch (error) {
                console.log("Erro ao definir o foco do campo '"+id+"'.");
            }
        },time || 1 );
    };
    

    vm.buscaCEP = function(){

        console.log(">>> passou buscaCEP");

        if (vm.condominio.cep && vm.condominio.cep.length===10){

            message.loading.show("Buscando Endereço...");

            var cep = vm.condominio.cep.replace(/\./g, "");
                cep = cep.replace(/\-/g, "");

            $http.get('https://viacep.com.br/ws/'+cep+'/json/').then(

                function(success){
                    var endereco = [];

                    success.data = success.data[0] || success.data;
                    
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

                    message.loading.hide();
                },

                function(err){
                    message.loading.hide();
                    console.log('>>> CEP não encontrado: ', err); 
                }

            );
        } else if(vm.condominio.cep && vm.condominio.cep.length){
            vm.alert("CEP incorreto!","CEP","id.cep");
        }
    }


    vm.validaDados = function(){
        
        if(!vm.condominio.nome){
            vm.alert("Favor informar o nome","Nome obrigatório","id.nome");
            return;
        }
        
        if(!vm.condominio.cep){
            vm.alert("Favor informar o CEP","CEP obrigatório","id.cep");
            return;
        }

        if(!vm.condominio.uf){
            vm.alert("Favor informar a UF","UF obrigatória","id.uf");
            return;
        }

        if(!vm.condominio.municipio){
            vm.alert("Favor informar o Município","Município obrigatório","id.municipio");
            return;
        }

        if(!vm.condominio.endereco){
            vm.alert("Favor informar o Endereço","Endereço obrigatório","id.endereco");
            return;
        }

        if(!vm.condominio.localizacao){
            vm.alert("Favor informar a Localização","Localização obrigatória",'id.confirma');
            return;
        }            

        return true;
    };

    vm.salvar = function(){
        
        if (vm.validaDados()){
            message.loading.show('Salvando os Dados');
            $http.put(CONST.REST.IP+'/altera/condominio/'+vm.condominio._id,vm.condominio).then(
                
                function(success){
                    message.loading.hide();
                    vm.alert("Dados salvos com sucesso", "Condomínio", null, function(){
                        $state.go("tabsController.registrarVisita");
                    })
                    // message.loading.show('Dados salvos com sucesso',2000);
                },

                function(err){
                    console.log('>>> err: ', err); 
                }

            );
        }
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
   
