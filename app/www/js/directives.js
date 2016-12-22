angular.module('app.directives', [])
    
    .directive('pattern', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                
                function fromUser(text) {
                    if (text) {

                        var pattern = new RegExp(attr.pattern.replace("[","[^"));
                        
                        var transformedInput = text.replace(pattern, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }

                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    })

    .directive("localizacao",['$cordovaGeolocation','$timeout','loading','$http','CONST',function($cordovaGeolocation,$timeout,loading,$http,CONST){

        return {
            restrict: 'A',
            scope: {zoom: '@', codigoMunicipio: '=', proximo: '@'},
            require: '?ngModel',
            link: function($scope,elem,attr,ngModel){
                
                if (!ngModel) return;
                // else $scope.$apply();

                var vm = {};
                
                vm.deviceLocation = true;

                var googleCoord = new google.maps.LatLng(CONST.COORDENADAS.LATITUDE, CONST.COORDENADAS.LONGITUDE);
                var googleMapOptions = {
                    center: googleCoord,
                    zoom: $scope.zoom || 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };    

                loading.show("Aguardando a localização...");

                // busca a localização do dispositivo
                var posOptions = {timeout: 4000, enableHighAccuracy: false, maximumAge: 0};
                $cordovaGeolocation.getCurrentPosition(posOptions).then(
                    function (position) {
                        
                        vm.la = position.coords.latitude
                        vm.lo = position.coords.longitude

                        // redefine a localização
                        googleMapOptions.center = new google.maps.LatLng(vm.la,vm.lo);
                        
                        ngModel.$setViewValue(vm.la+", "+vm.lo);
                        // $scope.definirLocalizacao(vm.la,vm.lo);

                        loading.hide();

                    }, function(err) {
                        vm.deviceLocation = false;
                        loading.hide(); 
                    }
                );

                elem.bind('click', function() {

                    var divMap = document.getElementById("map") || document.createElement("div");
                    divMap.setAttribute("id","map");
                    divMap.setAttribute("data-tap-disabled",true);
                    divMap.setAttribute("style","display:none;z-index: 1000;position:absolute;width: 100%;height: 100%;top:0px;left:0px;");
                    document.body.appendChild(divMap);

                    loading.show("Aguarde, abrindo Mapa");

                    if (vm.map){

                        $timeout(function() {
                            document.getElementById("map").style.display = "inline";
                            loading.hide();
                        },1000);

                    } else {

                        document.getElementById("map").style.display = "inline";

                        // centraliza o mapa na localização da cidade informada
                        // somente se não encontrou a localização do dispositivo                        
                        if (!vm.deviceLocation){

                            // filtro por: código do município
                            var config = {"params":{
                                codigo: {type:"number", value: $scope.codigoMunicipio} 
                            }};

                            if (config.value){

                                // busca as coordenadas (lat, long) com base no código do município definido no ngModel
                                $http.get(CONST.REST.IP+'/find/coordenada',config).then(

                                    function(response){
                                        googleMapOptions.center = new google.maps.LatLng(response.data[0].latitude,response.data[0].longitude);
                                    },
                                    function(err){ console.log(">>> erro ao busar localização: ",err); }
                                );
                            }

                        }

                        vm.map = new google.maps.Map(document.getElementById("map"), googleMapOptions);
                        vm.map.addListener('click', function(e) {
                            try {
                                
                                document.getElementById("map").style.display = "none";
                                
                                $scope.la = new String(Math.round(e.latLng.lat()*100000000)/100000000);
                                $scope.lo = new String(Math.round(e.latLng.lng()*100000000)/100000000);
                                
                                ngModel.$setViewValue($scope.la+", "+$scope.lo);
                                
                                $scope.definirLocalizacao($scope.la,$scope.lo);
                                
                            } catch (error) {
                                console.log('>>> Erro ao recuperar a localização: ', error); 
                            }

                            // define o foco após a seleção do mapa
                            if ($scope.proximo || $scope.proximo!="")
                                document.getElementById($scope.proximo).focus();
                        });
                        
                        loading.hide();
                    }
                    
                });

                $scope.definirLocalizacao = function(latitude,longitude)
                {
                    try {
                        // $scope.$parent.$parent.vm.localizacao = $scope.$parent.$parent.vm.dados.localizacao = latitude + ", " + longitude;
                        $scope.$parent.$parent.$apply();
                    } catch (error) {
                        // $scope.$parent.vm.localizacao = $scope.$parent.vm.dados.localizacao = latitude + ", " + longitude;
                        $scope.$parent.$apply(); 
                    } 
                   
                    // $scope.$apply();
                }

            }
        };
    }])
    .directive('proximoCampo', function () {
        return {
            restrict: 'A',
            scope: {proximoCampo: '@'},
            link: function ($scope, elem, attrs) {
                elem.bind('keydown', function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13) {
                        e.preventDefault();

                        var idProximo = $scope.proximoCampo.split("||");

                        idProximo.forEach(function(id){
                            var proximo = document.getElementById(id.trim());
                            try {
                                proximo.focus();
                            } catch (error) {
                                console.log(proximo, error);
                            } 
                        });

                        // elem.next().focus();
                    }
                });
            }
        }
    });

    // .directive('fileread', function ($q) {

    //     var slice = Array.prototype.slice;


    //     return {
    //     restrict: 'A',
    //         require: '?ngModel',
    //         link: function(scope, element, attrs, ngModel) {
    //                 if (!ngModel) return;

    //                 ngModel.$render = function() {};

    //                 element.bind('change', function(e) {
    //                     var element = e.target;

    //                     $q.all(slice.call(element.files, 0).map(readFile))
    //                         .then(function(values) {

    //                             console.log('>>> values: ', values); 

    //                             if (element.multiple) ngModel.$setViewValue(values);
    //                             else ngModel.$setViewValue(values.length ? values[0] : null);
    //                         });

    //                     function readFile(file) {

    //                         var deferred = $q.defer();
    //                         var reader = new FileReader();

    //                         reader.onload = function(e) {
    //                             deferred.resolve({
    //                                 "result":e.target.result,
    //                                 "file":file
    //                             });
    //                         };

    //                         reader.onerror = function(e) {
    //                             deferred.reject(e);
    //                         };
                            
    //                         reader.readAsDataURL(file);

    //                         return deferred.promise;
    //                     }

    //                 }); //change

    //             } //link
    //     }
    // });