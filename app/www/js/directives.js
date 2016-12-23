angular.module('app.directives', [])

    .directive("foto",['Camera',function(Camera){
        return{
            restrict: "E",
            scope: {},
            require: "?ngModel",
            templateUrl: "templates/diretivas/foto.html",
            link: function($scope,elem,attr,ngModel){

                $scope.sucesso = false;
                $scope.image = document.getElementById('imgCamera');

                /** Abre a câmera exibe a imagem  */
                $scope.foto = function(){
                    
                    Camera.abrir().then(
                        
                        function (imageData) {
                            console.log($scope.image);
                            $scope.image.src = "data:image/jpeg;base64," + imageData;

                            ngModel.$setViewValue($scope.image.src);
                            ngModel.$render();

                            $scope.sucesso = true;
                        }, 
                        
                        function (err) {
                            alert('Erro ao abrir a camera');
                            console.log(err);
                        }
                        
                    );

                }

            }
        }
    }])

    .directive("typeahead",['$http','CONST','$compile','$templateRequest',function($http,CONST,$compile,$templateRequest){
        return{
            restrict: 'A',
            scope: {collection:'@', field:'@', onSelect:"=", proximo:"@"},
            require: '?ngModel',
            link: function($scope,elem,attr,ngModel){
                
                // faz um append do template no parent
                $templateRequest('templates/diretivas/typeahead.html').then(function(html){
                    
                    // Convert the html to an actual DOM node
                    var template = angular.element(html);
                    
                    // Append it to the directive element
                    elem.parent().append(template);
                    
                    // And let Angular $compile it
                    $compile(template)($scope);

                });

                // pula o campo
                elem.bind('keydown', function (e) {
                    var code = e.keyCode || e.which;
                    if (code === 13 && $scope.proximo) {
                        e.preventDefault();
                        document.getElementById($scope.proximo).focus();
                    }
                    return;
                });

                elem.bind("keyup",function(e){

                    var code = e.keyCode || e.which;
                    
                    if (code === 27){
                        
                        ngModel.$setViewValue("");
                        ngModel.$render();
                        
                        $scope.lista = [];
                    } else if (ngModel.$viewValue) {
                        
                        var config = {"params":{}};
                        config.params[$scope.field] = ngModel.$viewValue;

                        $http.get(CONST.REST.IP+'/find/'+$scope.collection,config).then(
                            function(response){
                                $scope.lista = response.data;
                                $scope.selected = undefined;
                            },
                            function(error){}
                        );

                    }

                });

                elem.bind("blur",function(){
                    
                    $scope.lista = [];
                    $scope.$parent.$apply();
                    
                    if (!$scope.selected){
                        ngModel.$setViewValue("");
                        ngModel.$render();
                    }
                        
                });

                $scope.selecionarItem = function(item){
                    ngModel.$setViewValue(item[$scope.field]);
                    ngModel.$render();

                    if ($scope.onSelect)
                        $scope.onSelect(item); // callback

                    $scope.selected = item;

                    $scope.lista = [];
                };                

                $scope.exibirLista = function(){
                    return $scope.lista && $scope.lista.length && ngModel.$modelValue.length > 4;
                };

                $scope.obterValor = function(item){
                    return item[$scope.field];
                };

            }
        }
    }])

    .directive("localizacao",['$cordovaGeolocation','$timeout','loading','$http','CONST',function($cordovaGeolocation,$timeout,loading,$http,CONST){

        return {
            restrict: 'A',
            scope: {zoom: '@', codigoMunicipio: '=', proximo: '@'},
            require: '?ngModel',
            link: function($scope,elem,attr,ngModel){
                
                if (!ngModel) return;
                // else $scope.$apply();

                var vm = {};
                
                $scope.deviceLocation = true;

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
                        
                        $scope.la = position.coords.latitude
                        $scope.lo = position.coords.longitude

                        // redefine a localização
                        googleMapOptions.center = new google.maps.LatLng($scope.la,$scope.lo);
                        
                        ngModel.$setViewValue($scope.la+", "+$scope.lo);
                        // $scope.definirLocalizacao($scope.la,$scope.lo);

                        loading.hide();

                    }, function(err) {
                        $scope.deviceLocation = false;
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

                    if ($scope.map){

                        $timeout(function() {
                            document.getElementById("map").style.display = "inline";
                            loading.hide();
                        },1000);

                    } else {

                        document.getElementById("map").style.display = "inline";

                        // centraliza o mapa na localização da cidade informada
                        // somente se não encontrou a localização do dispositivo                        
                        if (!$scope.deviceLocation){

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

                        $scope.map = new google.maps.Map(document.getElementById("map"), googleMapOptions);
                        $scope.map.addListener('click', function(e) {
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
                        // $scope.$parent.$parent.$scope.localizacao = $scope.$parent.$parent.$scope.dados.localizacao = latitude + ", " + longitude;
                        $scope.$parent.$parent.$apply();
                    } catch (error) {
                        // $scope.$parent.$scope.localizacao = $scope.$parent.$scope.dados.localizacao = latitude + ", " + longitude;
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