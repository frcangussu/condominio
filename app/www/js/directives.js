angular.module('app.directives', [])

.directive('fileread', function ($q) {

    var slice = Array.prototype.slice;


    return {
       restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;

                ngModel.$render = function() {};

                element.bind('change', function(e) {
                    var element = e.target;

                    $q.all(slice.call(element.files, 0).map(readFile))
                        .then(function(values) {

                            console.log('>>> values: ', values); 

                            if (element.multiple) ngModel.$setViewValue(values);
                            else ngModel.$setViewValue(values.length ? values[0] : null);
                        });

                    function readFile(file) {

                        var deferred = $q.defer();
                        var reader = new FileReader();

                        reader.onload = function(e) {
                            deferred.resolve({
                                "result":e.target.result,
                                "file":file
                            });
                        };

                        reader.onerror = function(e) {
                            deferred.reject(e);
                        };
                        
                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }

                }); //change

            } //link
    }
});