var module = angular.module('DomainFactory', [ ]);

module.factory('DomainFactory', [ '$q', '$http', function($q, $http) {
    function _testDomain(url, packageName, appStoreId) {

        var requestUrl = '/resources/app-indexing/validate-app/?url=' + encodeURIComponent(url) + '&packageName=' + encodeURIComponent(packageName) + '&appStoreId=' + encodeURIComponent(appStoreId);
        
        return $q(function(resolve, reject) {
            $http.post(requestUrl)
                .then(function(response) {
                    resolve(response.data);
                });
        });
    }
    return {
        testDomain: _testDomain
    };
}]);
