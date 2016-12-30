    angular.module('app.bemVindoAoAPPCtrl', ['ngMask'])

    .controller('bemVindoAoAPPCtrl', ['$scope', '$stateParams', '$ionicPlatform', '$cordovaDevice', 'Texto', '$state','$http', 'CONST', 'uid',
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $ionicPlatform, $cordovaDevice, Texto, $state, $http, CONST, uid) {

        var vm = this;

        // mock
        // vm.destino = "cadastrarCondominio";
        // vm.destino = "cadastroDeSindico";
        vm.destino = "cadastroRecepcao";

        // identifica cadastro inicial
        if (localStorage.getItem("uid")){
            
            $state.go("tabsController.registrarVisita");
            // $state.go(vm.destino);

        } else {

            vm.condominio = false;
            vm.titular = false;

            vm.exibirTela = function(){
                if(vm.condominio)
                    return false;
                else 
                    return true;
            }

            /**
             * inicialização: verifica se o usuário já possui cadastro
             */
            $ionicPlatform.ready(function() {

                var device = $cordovaDevice.getDevice();
                vm.uid = device.manufacturer+"."+device.serial+"."+device.uuid;
                
                // recupera o id do condominio pelo uid do dispositivo
                uid.cadastrado(vm.uid,function(res){
                    
                    vm.condominios = res;

                    // se ainda não foi cadastrado permanece nesta tela para que o usuário informe o número do telefone
                    if (!Object.keys(vm.condominios).length){
                        return;
                    } else { // se já foi cadastrado
                        localStorage.setItem("uid",vm.uid);
                        localStorage.setItem("condominios",JSON.stringify(vm.condominios));
                        $state.go("tabsController.registrarVisita");
                    };
                });
                

            }, false);

        }


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
