angular.module('app.cadastroRecepcaoCtrl', [])

.controller('cadastroRecepcaoCtrl', ['$scope', '$stateParams', 'Camera', '$ionicPopup', 
function ($scope, $stateParams, Camera, $ionicPopup) {

    var vm = this;

    vm.dados = {};
    
    vm.obterCondominio = function(condominio){
        // vm.condominio.selecionado = $scope.onSelect;
        console.log('>>> condominio: ', condominio);  
        vm.dados.condominio = condominio; 
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

    vm.salvaDados = function()
    {
        if (vm.validaDados()){
            // http://192.168.1.7:3000/rest/sindico/cadastra
            // $http.post(CONST.REST.IP+'/sindico/cadastra',vm.sindico).then(

                    try {
                        // salva o uid
                        var device = $cordovaDevice.getDevice();
                        vm.dados.uid = device.manufacturer+"."+device.serial+"."+device.uuid;
                        localStorage.setItem("uid",vm.dados.uid);

                        $http.put(CONST.REST.IP+'/condominio/'+vm.condominio+'/altera/recepcionistas',vm.dados).then(
                            
                            function(success){
                                vm.alert("Os dados foram salvos com sucesso, solicite ao síndico a validação do seu cadastro.","Sucesso",null,function(){
                                    $state.go("bemVindoAoAPP");
                                });

                                // $state.go("tabsController.registrarVisita");
                            },

                            function(error){
                                vm.alert("Não foi possível salvar os dados, tente novamente mais tarde.", "Erro");
                            }
                        );

                    } catch (error) {
                        console.log("Dispositivo não está conectado");
                    }


        };
    };

    vm.validaDados = function(){
        
        if (!vm.dados.condominio){
            vm.alert("Favor informar o condomínio","Condomínio obrigatório","id.condominio");
            return;
        }

        if (!vm.dados.nome){
            vm.alert("Favor informar o nome","Nome obrigatório","id.nome");
            return;
        }

        if (!vm.dados.senha) {
            vm.alert("Favor informar a senha","Senha obrigatória","id.senha");
            return;
        }

        // exibe a confirmacao da senha
        if (!vm.dados.confirmaSenha){

            vm.exibeConfirmacaoSenha();
            // vm.exibirConfirmacaoSenha = true;
            vm.foco('id.confirmacao.senha',1000);
            return;
        }

        return true;
    }    

    vm.exibeConfirmacaoSenha = function(){
        
        var myPopup = $ionicPopup.show({
            template: '<input type="password" id="id.confirmacao.senha" ng-model="vm.dados.confirmaSenha" ng-on-enter="vm.salvaDados">',
            title: 'Confirme a sua senha',
            subTitle: '( esta senha será utilizada para acesso do APP na internet )',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Confirmar</b>',
                    id:   'id.alert.ok',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!vm.dados.confirmaSenha) {
                            e.preventDefault();
                        } else {
                            return vm.dados.confirmaSenha;
                        }
                    }
                }
            ]
        });
        
        myPopup.then(function(senha){
            vm.salvaDados();
        });  
    };    

    // /** Câmera */
    // vm.sucesso = false;
    // vm.image = document.getElementById('imgCamera');

    // /** Abre a câmera exibe a imagem  */
    // vm.foto = function(){
        
    //     Camera.abrir().then(
            
    //         function (imageData) {
    //             console.log(vm.image);
	// 			vm.image.src = "data:image/jpeg;base64," + imageData;
	// 			vm.sucesso = true;
	// 		}, 
            
    //         function (err) {
	// 			alert('Erro ao abrir a camera');
	// 			console.log(err);
	// 	    }
            
    //     );

    // };

}])