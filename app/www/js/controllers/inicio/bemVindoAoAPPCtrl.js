    angular.module('app.bemVindoAoAPPCtrl', ['ngMask'])

    .controller('bemVindoAoAPPCtrl', ['$scope', '$stateParams', '$cordovaDevice', 'texto', '$state','$http',
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $cordovaDevice, texto, $state, $http) {

        var vm = this;

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
        document.addEventListener("deviceready", function () {

            var device = $cordovaDevice.getDevice();
            vm.uid = device.manufacturer+"."+device.serial+"."+device.uuid;

            // recupera o id do condominio pelo uid do dispositivo
            vm.obtemCondominio("uid",vm.uid).then(function(response){
                
                vm.condominio = (response.data[0]) ? response.data[0]["_id"] : null ;

                if (!vm.condominio){
                    return;
                }

                // se existir o titular (consultadado por uid) navega para a tela inicial do app
                $http.get('http://192.168.1.4:3000/rest/condominio/'+vm.condominio+'/entidade/titulares/uid/'+vm.uid).then(
                    
                    // sucesso
                    function(response){
                        vm.titular = response.data[0].titulares[0];
                        
                        if (vm.titular && vm.titular.telefone){
                            $state.go("tabsController.registrarVisita");
                        } 
                    },

                    // erro
                    function(err){
                        alert('Erro ao tentar identificar o dispositivo');
                    }
                );
            }); 


        }, false);


        /**
         * Checa o cadastro do usuário antes de avançar
         */
        vm.avancar = function(){

            var telefone = texto.obterNumero(vm.telefone);

            // recupera o id do condominio pelo telefone informado
            vm.obtemCondominio("telefone",telefone).then(function(response){
                
                vm.condominio = (response.data[0]) ? response.data[0]["_id"] : null ;

                if (!vm.condominio){
                    $state.go("selecioneOSeuPapel");
                    return;
                }

                $http.get('http://192.168.1.4:3000/rest/condominio/'+vm.condominio+'/entidade/titulares/telefone/'+telefone).then(
                    function(response){
                        vm.titular = response.data[0].titulares[0];
                        if (vm.titular){
                            
                            if (!vm.titular.uid){
                                vm.atualizaUid();
                                alert('Dispositivo cadastrado com sucesso');
                            }
                            else if ((vm.uid != vm.titular.uid) && (confirm('Deseja atualizar o dispositivo?'))){
                                vm.atualizaUid();
                            }

                            $state.go("tabsController.registrarVisita");
                        } else {
                            $state.go("selecioneOSeuPapel");
                        }
                    }, 
                    function(err){
                        alert('Erro ao tentar localizar o usuário');
                    }
                );
            });
        }

        /**
         * retorna o "_id" do condominio de acordo com campo e valor informados
         */
        vm.obtemCondominio = function(campo,valor){
            return $http.get('http://192.168.1.4:3000/rest/condominio/porEntidade/titulares/'+campo+'/'+valor);
        }

        /**
         * Atualização do UID
         */
        vm.atualizaUid = function(){
            
            var params = {
                dados:  {"uid"      : vm.uid},
                filtro: {"telefone" : telefone}
            };

            $http.put('http://192.168.1.4:3000/rest/condominio/'+vm.condominio+'/altera/titulares',params).then(

                                    // sucesso
                                    function(response){
                                        console.log(response);
                                        alert("ID atualizado com sucesso");
                                    },

                                    // erro
                                    function(err){
                                        alert('Erro ao tentar validar o dispositivo');
                                    }
                                );
        }
        
    }])
