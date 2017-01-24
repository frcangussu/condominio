angular.module('app.services', [])

	.factory('BlankFactory', [function () {

	}])

	.service('validar', ['Texto',function (Texto) {
		this.cpf = function(strCPF) {

			strCPF = Texto.obterNumeros(strCPF);

			var Soma;
			var Resto;
			Soma = 0;
			if (strCPF == "00000000000") return false;

			for (i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
			Resto = (Soma * 10) % 11;

			if ((Resto == 10) || (Resto == 11)) Resto = 0;
			if (Resto != parseInt(strCPF.substring(9, 10))) return false;

			Soma = 0;
			for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
			Resto = (Soma * 10) % 11;

			if ((Resto == 10) || (Resto == 11)) Resto = 0;
			if (Resto != parseInt(strCPF.substring(10, 11))) return false;
			return true;
		}

		this.senha = function(pass){
			
			var score = 0;
			if (!pass)
				return score;

			// award every unique letter until 5 repetitions
			var letters = new Object();
			for (var i=0; i<pass.length; i++) {
				letters[pass[i]] = (letters[pass[i]] || 0) + 1;
				score += 5.0 / letters[pass[i]];
			}

			// bonus points for mixing it up
			var variations = {
				digits: /\d/.test(pass),
				lower: /[a-z]/.test(pass),
				upper: /[A-Z]/.test(pass),
				// nonWords: /\W/.test(pass),
			}

			variationCount = 0;
			for (var check in variations) {
				variationCount += (variations[check] == true) ? 1 : 0;
			}
			score += (variationCount - 1) * 10;

			console.log('>>> score: ', score); 

			return parseInt(score) > 55;
			
		}
	}])

	.service('uid',['$state','$cordovaDevice', 'message', '$http','CONST', function($state,$cordovaDevice,message,$http,CONST){
		
		this.cadastrado = function(uid, callback){

			var res  = {};

			// busca primeiro em titulares
			$http.get(CONST.REST.IP+'/condominio/porEntidade/titulares/uid/'+uid).then(function(response){
				
				if (response.data[0])
					res.titulares = response.data;

				// se não encontrar em "titulares" busca em "sindicos" 		
				$http.get(CONST.REST.IP+'/condominio/porEntidade/sindicos/uid/'+uid).then(function(response){
					
					if (response.data[0])
						res.sindicos = response.data;

					// se não encontrar em "sindicos" busca em "recepcionistas" 		
					$http.get(CONST.REST.IP+'/condominio/porEntidade/recepcionistas/uid/'+uid).then(function(response){
						
						if (response.data[0])
							res.recepcionistas = response.data;

						callback(res);

					},function(error){callback(res)});
						
				},function(error){callback(res)});
					
			},function(error){callback(res)});

		};

		this.obter = function(callback){
			
			// recebe dados construidos na primeira tela do APP (bemVindoAoAPP)
			var dados = {
				telefone : localStorage.getItem("telefone"),
				uid      : localStorage.getItem("uid")
			}

			if(!dados.telefone){
				message.alert.show("Alerta","A informação do telefone não foi localizada, favor informar novamente.",function(){
					$state.go("bemVindoAoAPP");
				});
			} else if (!dados.uid) {
				try {
					var device = $cordovaDevice.getDevice();
					dados.uid = device.manufacturer+"."+device.serial+"."+device.uuid;
					localStorage.setItem("uid",dados.uid);
					callback(dados);
				} catch (error) {
					message.alert.show("Permissão de Leitura", "Os dados do seu dispositivo não puderam ser lidos", function(){
						$state.go("bemVindoAoAPP");
					});
				}
			} else {
				callback(dados);
			}

		}		
		
	}])

	.service('message',['$ionicPopup','$ionicLoading',function($ionicPopup,$ionicLoading){
		
		this.alert = {
			show: function(title, msg, callback){
				var alerta = $ionicPopup.alert({
					title: title || "Alerta",
					template: msg,
					okText: "OK"
				});

				alerta.then(function(){
					
					if(callback)
						callback();
				});
			} 
		}; // alert

		this.loading = {
			show : function(msg,duration){

				var options = {};
				options.template = '<ion-spinner icon="lines"></ion-spinner><br/><br/>'+msg
				if (duration)
					options.duration = duration;

				$ionicLoading.show(options);
			},

			hide : function(){
				$ionicLoading.hide();
			}
		}; // loading

	}])

	.service('Texto', [function () {

		/**
		 * extrair somente os numeros de uma string
		 */
		this.obterNumeros = function (valor) {

			if (!valor)
				return;
				
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