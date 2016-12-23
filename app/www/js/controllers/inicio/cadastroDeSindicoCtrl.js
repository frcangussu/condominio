angular.module('app.cadastroDeSindicoCtrl', [])

.controller('cadastroDeSindicoCtrl', ['$scope', '$stateParams','Camera', '$timeout', '$http', 'CONST', '$cordovaDevice',
 // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Camera, $timeout, $http, CONST, $cordovaDevice) {
    var vm = this;

    vm.sindico = {};

    vm.exibirConfirmacaoSenha = false;
    vm.salvaDados = function(){

        if (vm.validaDados()){
            // http://192.168.1.7:3000/rest/sindico/cadastra
            $http.post(CONST.REST.IP+'/sindico/cadastra',vm.sindico).then(function(res){
                
                // salva o uid
                try {
                    var device = $cordovaDevice.getDevice();
                    vm.uid = device.manufacturer+"."+device.serial+"."+device.uuid;
                    localStorage.setItem("uid",vm.uid);
                } catch (error) {
                    console.log("Dispositivo não está conectado");
                }

                console.log(res);

                $ionicPopup.alert({
                    title: "Sucesso",
                    template: "Os dados foram salvos com sucesso",
                    okText: "OK"
                });

                // $state.go("tabsController.registrarVisita");
            });
        };

    };

    vm.validaDados = function(){
        if (!vm.sindico.nome){
            alert("Favor informar o nome");
            $timeout(vm.foco('txtNome'),500);
            return;
        }

        if (!vm.sindico.senha) {
            alert("Favor informar a senha");
            $timeout(vm.foco('txtSenha'),500);
            return;
        }

        if (!vm.sindico.confirmaSenha && !vm.exibirConfirmacaoSenha){
            vm.exibirConfirmacaoSenha = true;
            $timeout(vm.foco('txtConfirmaSenha'),1000);
            return;
        }

        if (vm.sindico.confirmaSenha != vm.sindico.senha) {
            alert("A senha não confere, favor informar novamente");
            vm.sindico.senha = "";
            vm.sindico.confirmaSenha = "";
            vm.exibirConfirmacaoSenha = false;
            $timeout(vm.foco('txtSenha'),500);
            return;
        }

        return true;
    };

    vm.foco = function(id){
        var campo = document.getElementById(id);
        campo.focus();
    };

}])