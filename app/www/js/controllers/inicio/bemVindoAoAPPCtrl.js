    angular.module('app.bemVindoAoAPPCtrl', ['ngMask'])

    .controller('bemVindoAoAPPCtrl', ['$scope', '$stateParams', '$ionicPlatform', '$cordovaDevice', 'Texto', '$state','$http', 'PARAMS',
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $ionicPlatform, $cordovaDevice, Texto, $state, $http, PARAMS) {

        var vm = this;

        vm.destino = "cadastrarCondominio";

        // mock
        // $state.go(vm.destino);

        // identifica cadastro inicial
        if (localStorage.getItem("uid")){
            
            console.log(localStorage.getItem("uid"));

            // $state.go("tabsController.registrarVisita");
            $state.go(vm.destino);

        } else {

            console.log(">>>> Passou A <<<<");

            vm.condominio = false;
            vm.titular = false;

            vm.exibirTela = function(){
                if(vm.condominio)
                    return false;
                else return true;
            }

            /**
             * inicialização: verifica se o usuário já possui cadastro
             */
            $ionicPlatform.ready(function() {

                var device = $cordovaDevice.getDevice();
                vm.uid = device.manufacturer+"."+device.serial+"."+device.uuid;
                
                // recupera o id do condominio pelo uid do dispositivo
                vm.obtemCondominio("uid",vm.uid).then(function(response){
                    
                    vm.condominio = (response.data[0]) ? response.data[0]["_id"] : null ;

                    // se ainda não foi cadastrado retorna para que o usuário informe o número do telefone
                    if (!vm.condominio){
                        alert('O seu UID não foi localizado em nossos registros');
                        return;
                    }

                    console.log(">>> uid: ",vm.uid);

                    localStorage.setItem("uid",vm.uid);
                    // localStorage.setItem("condominio",vm.condominio);

                    // se existir o titular (consultadado por uid) navega para a tela inicial do app
                    $http.get(PARAMS.REST.IP+'/condominio/'+vm.condominio+'/entidade/titulares/uid/'+vm.uid).then(

                        // sucesso
                        function(response){

                            vm.titular = response.data[0].titulares[0];


                            localStorage.setItem("usuario",JSON.stringify(vm.titular));
                            
                            console.log(">>> vm.titular: ",vm.titular);
                            if (vm.titular && vm.titular.telefone){
                                // $state.go("tabsController.registrarVisita");
                                $state.go(vm.destino);
                                console.log(">>>> Passou B.1 <<<<");
                            } 
                            console.log(">>>> Passou B.2 <<<<");


                        },

                        // erro
                        function(err){
                            alert('Erro ao tentar identificar o dispositivo');
                        }
                    );
                }); 


            }, false);

        }


        /**
         * Checa o cadastro do usuário antes de avançar
         */
        vm.avancar = function(){

            var telefone = Texto.obterNumero(vm.telefone);

            // recupera o id do condominio pelo telefone informado
            vm.obtemCondominio("telefone",telefone).then(function(response){
                
                vm.condominio = (response.data[0]) ? response.data[0]["_id"] : null ;

                if (!vm.condominio){
                    // $state.go("selecioneOSeuPapel");
                    $state.go(vm.destino);
                    return;
                }

                console.log(">>>> Passou C <<<<");

                $http.get(PARAMS.REST.IP+'/condominio/'+vm.condominio+'/entidade/titulares/telefone/'+telefone).then(
                    function(response){
                        vm.titular = response.data[0].titulares[0];
                        if (vm.titular){
                            
                            localStorage.setItem("usuario",JSON.stringify(vm.titular));

                            // Atualização do UID
                            if (!vm.titular.uid){
                                vm.atualizaUid('Dispositivo cadastrado com sucesso');
                            } else if ((vm.uid != vm.titular.uid) && (confirm('Deseja atualizar o dispositivo?'))){
                                vm.atualizaUid('Dispositivo atualizado com sucesso');
                            }

                            //////////////////////////////////////////////////////
                            // Implementar rotina de validação por SMS e E-mail //
                            //////////////////////////////////////////////////////
                            vm.exibirValidacao = true;
                            
                            // $state.go("tabsController.registrarVisita");
                            $state.go(vm.destino);
                        } else {
                            // $state.go("selecioneOSeuPapel");
                            $state.go(vm.destino);
                        }

                        console.log(">>>> Passou D <<<<");
                        
                    }, 
                    function(err){
                        alert('Erro ao tentar localizar o usuário');
                    }
                );
            });
        } //avancar

        /**
         * retorna o "_id" do condominio de acordo com campo e valor informados
         */
        vm.obtemCondominio = function(campo,valor){
            return $http.get(PARAMS.REST.IP+'/condominio/porEntidade/titulares/'+campo+'/'+valor);
        }

        /**
         * Atualização o UID do usuário
         */
        vm.atualizaUid = function(msg){

            var params = {
                dados:  {"uid"      : vm.uid},
                filtro: {"telefone" : telefone}
            };

            $http.put(PARAMS.REST.IP+'/condominio/'+vm.condominio+'/altera/titulares',params).then(

                // sucesso
                function(response){ alert(msg); },

                // erro
                function(err){ alert('Erro ao tentar validar o dispositivo'); }
            );
        }
        
    }])
