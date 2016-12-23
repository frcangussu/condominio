angular.module('app.services', [])

	.factory('BlankFactory', [function () {

	}])

	.service('loading', ['$ionicLoading', function ($ionicLoading){
		this.show = function(msg,duration){

			var options = {};
			options.template = '<ion-spinner icon="lines"></ion-spinner><br/><br/>'+msg
			if (duration)
				options.duration = duration;

			$ionicLoading.show(options);
		}

		this.hide = function(){
			$ionicLoading.hide();
		}
	}])

	.service('Texto', [function () {

		/**
		 * extrair somente os numeros de uma string
		 */
		this.obterNumeros = function (valor) {
			var numberPattern = /\d+/g;
			return valor.match(numberPattern).join("");
		}

	}])

	.service('Lista', [function () {

		/**
		 * Localiza e retorna um elemento do array
		 */
		this.obterItem = function (lista, campo, valor) {
			return lista.find(function (item) {
				return (item[campo] == valor) ? item : false;
			});
		}

	}])

	.service('Camera', ['$cordovaCamera', function ($cordovaCamera) {
		
		this.abrir = function () {
			
			var options = {
				quality: 90,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 250,
				targetHeight: 250,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false,
				correctOrientation: true
			};

			return $cordovaCamera.getPicture(options);


		}
	}])

	;