angular.module('app.cadastroRecepcaoCtrl', [])

.controller('cadastroRecepcaoCtrl', ['$scope', '$stateParams', 'Camera',
function ($scope, $stateParams, Camera) {

    var vm = this;

    vm.condominio = {};
    vm.obterCondominio = function(condominio){
        vm.condominio.selecionado = $scope.onSelect; 
    }

    /** Câmera */
    vm.sucesso = false;
    vm.image = document.getElementById('imgCamera');

    /** Abre a câmera exibe a imagem  */
    vm.foto = function(){
        
        Camera.abrir().then(
            
            function (imageData) {
                console.log(vm.image);
				vm.image.src = "data:image/jpeg;base64," + imageData;
				vm.sucesso = true;
			}, 
            
            function (err) {
				alert('Erro ao abrir a camera');
				console.log(err);
		    }
            
        );

    }

}])