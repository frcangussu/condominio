    angular.module('app.bemVindoAoAPPCtrl', ['ngMask'])

    .controller('bemVindoAoAPPCtrl', ['$scope', '$stateParams', '$ionicPlatform', '$cordovaDevice', 'Texto', '$state','$http', 'CONST',
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($scope, $stateParams, $ionicPlatform, $cordovaDevice, Texto, $state, $http, CONST) {

        var vm = this;

        // mock
        // vm.destino = "cadastrarCondominio";
        // vm.destino = "cadastroDeSindico";
        vm.destino = "cadastroRecepcao";

        console.log(vm.destino);

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
                    $http.get(CONST.REST.IP+'/condominio/'+vm.condominio+'/entidade/titulares/uid/'+vm.uid).then(

                        // sucesso
                        function(response){

                            vm.titular = response.data[0].titulares[0];


                            localStorage.setItem("usuario",JSON.stringify(vm.titular));
                            
                            console.log(">>> vm.titular: ",vm.titular);
                            if (vm.titular && vm.titular.telefone){
                                // $state.go("tabsController.registrarVisita");
                                $state.go(vm.destino);
                                console.log(">>>> Passou B.1 <<<<");
                            } else {
                                alert("Usuário não localizado, favor solicitar cadastro");
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

            var telefone = Texto.obterNumeros(vm.telefone);

            if (telefone.length < 10){
                alert("Informe o número de telefone com o DDD + 11 dígitos");
                return;
            }

            // recupera o id do condominio pelo telefone informado
            vm.obtemCondominio("telefone",telefone).then(function(response){
                
                vm.condominio = (response.data[0]) ? response.data[0]["_id"] : null ;

                // caso ainda não tenha sido cadastrado o usuário, então trata-se de cadastro de síndico ou recepção
                if (!vm.condominio){
                    // $state.go("selecioneOSeuPapel");
                    $state.go(vm.destino);
                    return;
                }

                console.log(">>>> Passou C <<<<");

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
                                    console.log(">>>> usuário cadastrado: ",res);
                                    localStorage.setItem("telefone",telefone);
                                },
                                function(error){
                                    console.log("Erro ao cadastrar o documento usuário: ",error);
                                }
                            );
                            
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
            return $http.get(CONST.REST.IP+'/condominio/porEntidade/titulares/'+campo+'/'+valor);
        }

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
                function(response){ alert(msg); },

                // erro
                function(err){ alert('Erro ao tentar validar o dispositivo'); }
            );
        }
        
    }])
