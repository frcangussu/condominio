angular.module('app.ticketsRecebidosCtrl', [])

.controller('ticketsRecebidosCtrl', ['$scope', '$stateParams', '$http', 'CONST', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, CONST) {
console.log('Visitantes');
	var vm  = this;

	$http.get(CONST.REST.IP + '/convite/listar', {params: {telefone: 61991330123}})
	.success(function (response){
		console.log(response);
		if(response.type === 'ERROR')
			console.log('teste');
		else
			vm.convites = response[0].titulares[0].convites;
		console.log(vm.convites);
	});


}]);
