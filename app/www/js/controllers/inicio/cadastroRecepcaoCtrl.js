angular.module('app.cadastroRecepcaoCtrl', [])

.controller('cadastroRecepcaoCtrl', ['$scope', '$state', 'Camera', '$ionicPopup','$timeout','$cordovaDevice', 'CONST', '$http','uid', 'message',
function ($scope, $state, Camera, $ionicPopup, $timeout, $cordovaDevice, CONST, $http, uid, message) {

    var vm = this;

    vm.dados = {};
    vm.condominio = {};
    
    vm.obterCondominio = function(condominio){
        debugger;
        vm.condominio = condominio; 
        vm.dados.condominio = condominio._id;
        vm.foco("id.nome");
    }

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
    };

    vm.salvaDados = function()
    {
        if (vm.validaDados()){

            uid.obter(function(res){
                vm.dados.uid      = res.uid;
                vm.dados.telefone = res.telefone;
            });

            $http.get(CONST.REST.IP+'/condominio/porEntidade/recepcionistas/cpf/'+vm.dados.cpf).then(
                function(success){

                    // Verifica se o cpf já está cadastrado                    
                    var cadastrado = false;
                    success.data.forEach(function(e,i,a){
                        if (e._id === vm.condominio._id){
                            cadastrado = true;
                            vm.alert("Você já está cadastrado no condomínio "+vm.condominio.nome);
                            $state.go("tabsController.registrarVisita");
                            return;
                        }
                    });

                    vm.dadosUsuario = Object.assign({}, vm.dados); // duplica o objeto sem manter a referência
                    delete vm.dadosUsuario["condominio"];

                    // se não está cadastrado, então realiza o cadastro
                    if (!cadastrado)
                    {
                        $http.post(CONST.REST.IP+'/usuario/cadastra',vm.dadosUsuario).then(
                            
                            function(success){
                                vm.dados.inicio = "";
                                debugger;
                                $http.post(CONST.REST.IP+'/cadastra/recepcionistas',vm.dados).then(
                                    function(success){
                                        vm.alert("Os dados foram salvos com sucesso, solicite ao síndico a validação do seu cadastro.","Sucesso",null,function(){
                                            // $state.go("bemVindoAoAPP");
                                            $state.go("tabsController.registrarVisita");
                                        });

                                    },

                                    function(error){
                                        vm.alert("Não foi possível salvar os dados, tente novamente mais tarde.", "Erro");
                                    }
                                );
                            },

                            function(error){
                                console.log("Erro ao cadastrar o documento usuário: ",error);
                            }
                        );            



                    }

                },
                
                function(error){
                    vm.alert("Não foi possível salvar os dados, tente novamente mais tarde;","Erro");
                    return;
                }
            );



        };
    };

    vm.validaDados = function(){
        
        if (!vm.condominio.nome){
            vm.alert("Favor informar o condomínio","Condomínio obrigatório","id.condominio");
            return;
        }

        if (!vm.dados.nome){
            vm.alert("Favor informar o nome","Nome obrigatório","id.nome");
            return;
        }

        if (!vm.dados.cpf){
            vm.alert("Favor informar o CPF","CPF obrigatório","id.cpf");
            return;
        }

        if (!vm.dados.senha) {
            vm.alert("Favor informar a senha","Senha obrigatória","id.senha");
            return;
        }

        // exibe a confirmacao da senha
        if (!vm.confirmaSenha){

            vm.exibeConfirmacaoSenha();
            // vm.exibirConfirmacaoSenha = true;
            vm.foco('id.confirmacao.senha',1000);
            return;
        }

        if (vm.confirmaSenha != vm.dados.senha) {
            vm.alert("A senha não confere, favor informar novamente","Alerta");
            vm.dados.senha = "";
            vm.confirmaSenha = "";
            vm.foco('id.senha',500);
            return;
        }

        return true;
    }    

    vm.exibeConfirmacaoSenha = function(){
        
        var myPopup = $ionicPopup.show({
            template: '<input type="password" id="id.confirmacao.senha" ng-model="vm.confirmaSenha" ng-on-enter="vm.salvaDados">',
            title: 'Confirme a sua senha',
            subTitle: '( esta senha será utilizada para acesso do APP na internet )',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancelar',
                    onTap: function(e){
                        vm.confirmaSenha =
                        vm.dados.senha = null;
                        vm.foco("id.senha");
                    } 
                },
                {
                    text: '<b>Confirmar</b>',
                    id:   'id.alert.ok',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!vm.confirmaSenha) {
                            e.preventDefault();
                        } else {
                            return vm.confirmaSenha;
                        }
                    }
                }
            ]
        });
        
        myPopup.then(function(senha){
            if (senha) 
                vm.salvaDados();
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