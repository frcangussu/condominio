angular.module('app.cadastroDeSindicoCtrl', [])

.controller('cadastroDeSindicoCtrl', ['$scope', '$stateParams','Camera', '$timeout', '$http', 'CONST', '$cordovaDevice','$ionicPopup', '$state', 'uid', 'message',
function ($scope, $stateParams, Camera, $timeout, $http, CONST, $cordovaDevice, $ionicPopup, $state, uid, message) {
    var vm = this;

    vm.sindico = {};

    vm.exibirConfirmacaoSenha = false;
    vm.salvaDados = function(){

        if (vm.validaDados()){

            uid.obter(function(res){
                
                vm.sindico.uid      = res.uid;
                vm.sindico.telefone = res.telefone;
                vm.sindico.ativo    = true;

                $http.post(CONST.REST.IP+'/sindico/cadastra',vm.sindico).then(
            
                    function(response){

                        delete vm.sindico["condominio"];
                        
                        $http.post(CONST.REST.IP+'/usuario/cadastra',vm.sindico).then(
                            
                            function(success){
                                vm.alert("Os dados foram salvos com sucesso","Sucesso",null,function(){
                                    $state.go("cadastrarCondominio");
                                });
                                // $state.go("tabsController.registrarVisita");
                            },

                            function(error){
                                console.log("Erro ao cadastrar o documento usuário: ",error);
                            }
                        );            

                    },

                    function(error){
                        vm.alert("Não foi possível salvar os dados, tente novamente mais tarde.", "Erro");
                    }
                );
            });

        };

    };

    vm.exibeConfirmacaoSenha = function(){
        var myPopup = $ionicPopup.show({
            template: '<input type="password" id="id.confirmacao.senha" ng-model="vm.sindico.confirmaSenha" ng-on-enter="vm.salvaDados">',
            title: 'Confirme a sua senha',
            subTitle: '( esta senha será utilizada para acesso do APP na internet )',
            scope: $scope,
            buttons: [
                { 
                    text: 'Cancelar',
                    onTap: function(e){
                        vm.sindico.confirmaSenha =
                        vm.sindico.senha = null;
                        vm.foco("id.senha");
                    } 
                },
                {
                    text: '<b>Confirmar</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!vm.sindico.confirmaSenha) {
                            e.preventDefault();
                        } else {
                            return vm.sindico.confirmaSenha;
                        }
                    }
                }
            ]
        });
        
        myPopup.then(function(senha){
            vm.salvaDados();
        });  
    };

    vm.validaDados = function(){
        if (!vm.sindico.nome){
            vm.alert("Favor informar o nome","Nome obrigatório","id.nome");
            return;
        }

        if (!vm.sindico.cpf) {
            vm.alert("Favor informar o CPF","CPF obrigatório","id.cpf");
            return;
        }

        if (!vm.sindico.senha) {
            vm.alert("Favor informar a senha","Senha obrigatória","id.senha");
            return;
        }

        // exibe a confirmacao da senha
        if (!vm.sindico.confirmaSenha && !vm.exibirConfirmacaoSenha){

            vm.exibeConfirmacaoSenha();
            // vm.exibirConfirmacaoSenha = true;
            vm.foco('id.confirmacao.senha',1000);
            return;
        }

        if (vm.sindico.confirmaSenha != vm.sindico.senha) {

            vm.alert("A senha não confere, favor informar novamente","Alerta");
            
            vm.sindico.senha = "";
            vm.sindico.confirmaSenha = "";
            vm.exibirConfirmacaoSenha = false;
            vm.foco('id.senha',500);
            return;
        }

        return true;
    };

    vm.alert = function(msg, title, foco, callback){

        message.alert.show(title,msg,function(){
            if(foco || vm.focoId)
                vm.foco(foco || vm.focoId,100);
            
            if(callback)
                callback();
        })

        // var alerta = $ionicPopup.alert({
        //     title: title || "Alerta",
        //     template: msg,
        //     okText: "OK"
        // });

        // alerta.then(function(){
            
        //     if(foco || vm.focoId)
        //         vm.foco(foco || vm.focoId,100);
            
        //     if(callback)
        //         callback();
        // });
    }

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

}])