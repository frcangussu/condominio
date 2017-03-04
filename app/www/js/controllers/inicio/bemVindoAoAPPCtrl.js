    angular.module('app.bemVindoAoAPPCtrl', ['ngMask'])

    .controller('bemVindoAoAPPCtrl', ['$rootScope','$scope', '$stateParams', '$ionicPlatform', '$cordovaDevice', 'Texto', '$state','$http', 'CONST', 'uid', 'message',
    function ($rootScope, $scope, $stateParams, $ionicPlatform, $cordovaDevice, Texto, $state, $http, CONST, uid, message) {

        var vm = this;

        vm.exibir = false;

        debugger;
        message.loading.show("Aguarde...");

        // mock
        // vm.destino = "cadastrarCondominio";
        // vm.destino = "cadastroDeSindico";
        vm.destino = "cadastroRecepcao";

        // identifica cadastro inicial
        // if (localStorage.getItem("uid")){
            
        //     $state.go("tabsController.registrarVisita");
            
        //     // $state.go(vm.destino);

        // } else {

            vm.condominio = false;
            vm.titular = false;

            /**
             * inicialização: verifica se o usuário já possui cadastro
             */
            $ionicPlatform.ready(function() {

                var device = $cordovaDevice.getDevice();
                vm.uid = device.manufacturer+"."+device.serial+"."+device.uuid;
                
                // recupera o id do condominio pelo uid do dispositivo
                uid.cadastrado(vm.uid,
                
                    function(res){
                        
                        console.log('>>> res: ', res);

                        vm.souCadastradoComo = res;

                        $rootScope.cadastro = res;

                        message.loading.hide();

                        // se ainda não foi cadastrado permanece nesta tela para que o usuário informe o número do telefone
                        if (!Object.keys(vm.souCadastradoComo).length){
                            vm.exibir=true;
                            return;
                        } else { // se já foi cadastrado
                            localStorage.setItem("uid",vm.uid);
                            localStorage.setItem("condominios",JSON.stringify(vm.souCadastradoComo));
                            
                            if (vm.souCadastradoComo.titular || vm.souCadastradoComo.inquilino || vm.souCadastradoComo.sindico)
                                $state.go("tabsController.registrarVisita");
                            else if (vm.souCadastradoComo.recepcionista)
                                $state.go("tabsController.liberarEntrada");
                        };
                    },

                    function(err){
                        message.loading.hide();
                        message.alert.show("Erro", "Serviço não localizado");
                    }
                );
                

            }, false);

        // }


        /**
         * Checa o cadastro do usuário antes de avançar
         */
        vm.avancar = function(){

            var telefone = Texto.obterNumeros(vm.telefone);

            if (telefone.length < 10){
                $ionicPopup.alert({title: "Alerta", template: "Informe o número de telefone com o DDD + 11 dígitos.",okText: "OK"});
                return;
            }

            // recupera o id do condominio pelo telefone informado
            $http.get(CONST.REST.IP+'/condominio/porEntidade/titulares/telefone/'+telefone).then(function(response){
                
                vm.condominio = (response.data[0]) ? response.data[0]["_id"] : null ;

                // caso ainda não tenha sido cadastrado o usuário, então trata-se de cadastro de síndico ou recepção
                if (!vm.condominio){
                    
                    if (telefone)
                        localStorage.setItem("telefone",telefone);
                    
                    $state.go("selecioneOSeuPapel");
                    // $state.go(vm.destino);

                    return;
                }

                $http.get(CONST.REST.IP+'/condominio/'+vm.condominio+'/entidade/titulares/telefone/'+telefone).then(
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

                            // registra o usuário na colection "usuarios"
                            $http.post(CONST.REST.IP+'/usuario/cadastra',{"uid":vm.uid, "telefone": telefone}).then(
                                function(res){
                                    // console.log(">>>> usuário cadastrado: ",res);
                                    localStorage.setItem("telefone",telefone);
                                },
                                function(error){
                                    console.log("Erro ao cadastrar o documento usuário: ",error);
                                }
                            );
                            
                            $state.go("tabsController.registrarVisita");
                            // $state.go(vm.destino);
                        } else {
                            $state.go("selecioneOSeuPapel");
                            // $state.go(vm.destino);
                        }

                    }, 
                    function(err){
                        $ionicPopup.alert({title: "Alerta", template: "Erro ao tentar localizar o usuário.",okText: "OK"});
                    }
                );
            });
        } //avancar

        /**
         * Atualização o UID do usuário
         */
        vm.atualizaUid = function(msg){

            var params = {
                dados:  {"uid"      : vm.uid},
                filtro: {"telefone" : telefone}
            };

            $http.put(CONST.REST.IP+'/condominio/'+vm.condominio+'/altera/titulares',params).then(

                // sucesso
                function(response){ 
                    $ionicPopup.alert({title: "Sucesso", template: msg,okText: "OK"});
                },

                // erro
                function(err){ 
                    $ionicPopup.alert({title: "Alerta", template: "Erro ao tentar validar o dispositivo.",okText: "OK"});
                }
            );
        }
        
    }])
