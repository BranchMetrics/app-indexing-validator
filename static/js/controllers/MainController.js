var module = angular.module('MainController', [ 'DomainFactory']);

module.controller('MainController', ['$scope', '$location', '$anchorScroll', 'DomainFactory', function($scope, $location, $anchorScroll, domainFactory) {
    
    $scope.testResults = '';
    $scope.domainInputVal = '';
    $scope.packageName = '';
    $scope.appStoreId = '';
    $scope.showresultsvalue = false;

    $scope.scrollTo = function() {
        $location.hash('resultsbox');
        $anchorScroll();
    }

    $scope._defer = function(func) {
        return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };

    $scope.keyUp = function(evt) {
        if (evt.keyCode == 13) {
            $scope.beginTest();
        }
    };

    $scope.beginTest = function() {
        if (!$scope.domainInputVal.length) {
            alert('Domain is required');
            return;
        }
        
        else {
            domainFactory.testDomain($scope.domainInputVal, $scope.packageName, $scope.appStoreId)
                .then(function(results) {
                    console.log('MainController', results);
                    $scope.testResults = results.testResults;
                    $scope.showresultsvalue = true;
                })
                .catch(function(err) {
                    alert(err);
                });
        }
    };

    $scope.listGroupItemClassForValue = function(badValue) {
        if (badValue === true) {
            return 'list-group-item-danger';
        }
        else if (badValue === false) {
            return 'list-group-item-success';
        }

        return 'disabled';
    };

     $scope.divClassForValue = function(badValue){
        if (badValue === true){
            return 'alert-danger';
        } 
        else if(badValue === false){
            return 'alert-success';
        }
        return 'alert-warning';
     }

    $scope.displayWebpage = function(type, itemRequested){

        var webpage = $scope.testResults.webpage;
        var okToValidate = !webpage.breakingError;

        if(type == 'summary' && !okToValidate){
            if(itemRequested == 'divClass') return $scope.divClassForValue(true);
            return 'We tried to fetch your webpage file at ' + webpage.location + ' but could not retrieve it. As a result, no tests were run.';
        }
        else if(type == 'summary' && okToValidate && (webpage.invalidAndroidScheme || webpage.invalidAndroidHost || webpage.invalidiOSScheme || webpage.invalidiOSHost)){
            if(itemRequested == 'divClass') return $scope.divClassForValue(undefined);
            return 'We retrived your webpage at ' + webpage.location + ' but it did not pass every test.';
        }
        else if(type == 'summary' && okToValidate && !webpage.invalidAndroidScheme && !webpage.invalidAndroidHost && !webpage.invalidiOSScheme && !webpage.invalidiOSHost){
            if(itemRequested == 'divClass') return $scope.divClassForValue(false);
            return 'We retrived your webpage at ' + webpage.location + ' and it validated successfully.';
        }

        if(type == 'invalidAndroidScheme' && !okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Android scheme check did not run. ';
        }
        else if(type == 'invalidAndroidScheme' && webpage.invalidAndroidScheme && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your webpage does not have an android-app url in a <link rel=\"alternate\"> tag.';
        }
        else if(type == 'invalidAndroidScheme' && !webpage.invalidAndroidScheme && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your webpage includes an android-app url in a <link rel=\"alternate\"> tag.';
        }

        if(type == 'invalidAndroidHost' && !okToValidate && webpage.invalidAndroidScheme){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(undefined);
            return 'Android package name check did not run because your webpage does not have an android-app url in a <link rel=\"alternate\"> tag.';
        }
        else if(type == 'invalidAndroidHost' && webpage.invalidAndroidHost && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your webpage does not include your app\'s package name as part of a android-app url in a <link rel=\"alternate\"> tag.';
        }
        else if(type == 'invalidAndroidHost' && !webpage.invalidAndroidHost && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your webpage correctly includes your app\'s package name as part of a android-app url in the <link rel=\"alternate\"> tag.';
        }

        if(type == 'invalidiOSScheme' && !okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'iOS scheme check did not run.';
        }
        else if(type == 'invalidiOSScheme' && webpage.invalidiOSScheme && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your webpage does not have an ios-app url in a <link rel=\"alternate\"> tag.';
        }
        else if(type == 'invalidiOSScheme' && !webpage.invalidiOSScheme && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your webpage includes an ios-app url in a <link rel=\"alternate\"> tag.';
        }

        if(type == 'invalidiOSHost' && !okToValidate && webpage.invalidiOSScheme){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(undefined);
            return 'iOS App Store ID check did not run because your webpage does not have an ios-app url in a <link rel=\"alternate\"> tag.';
        }
        else if(type == 'invalidiOSHost' && webpage.invalidiOSHost && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your webpage does not include your app\'s App Store ID as part of a ios-app url in a <link rel=\"alternate\"> tag.';
        }
        else if(type == 'invalidiOSHost' && !webpage.invalidiOSHost && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your webpage correctly includes your app\'s App Store ID as part of a ios-app url in a <link rel=\"alternate\"> tag.';
        }

    }
    $scope.displayRobots = function(type, itemRequested){

        var robots = $scope.testResults.robots;
        var okToValidate = !robots.breakingError;

        if(type == 'summary' && !okToValidate){
            if(itemRequested == 'divClass') return $scope.divClassForValue(true);
            return 'We tried to fetch your robots.txt file at ' + robots.location + ' but could not retrieve it.';
        }
        else if(type == 'summary' && okToValidate && robots.invalidUserAgent){
             if(itemRequested == 'divClass') return $scope.divClassForValue(undefined);
            return 'We retrived your robots.txt file at ' + robots.location + ' but it did not pass every test.';
        }
        else if(type == 'summary' && okToValidate && !robots.invalidUserAgent){
             if(itemRequested == 'divClass') return $scope.divClassForValue(false);
            return 'We retrived your robots.txt file at ' + robots.location + ' and it validated successfully.';
        }

        if(type == 'invalidUserAgent' && !okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(undefined);
            return 'googlebot test did not run but your site may still be crawled.';
        }
        else if(type == 'invalidUserAgent' && okToValidate && robots.invalidUserAgent){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'googlebot is blocked from crawling and indexing your webpage.';
        }
        else if(type == 'invalidUserAgent' && okToValidate && !robots.invalidUserAgent){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'googlebot is able to crawl and index your webpage.';
        }
    }
    $scope.displayAssetlink = function(type, itemRequested){

        var assetlinks = $scope.testResults.assetlinks;

        var okToValidate = !assetlinks.breakingError;

        if(type == 'summary' && !okToValidate){
            if(itemRequested == 'divClass') return $scope.divClassForValue(true);
            return assetlinks.location + ' -- we tried to fetch your assetlinks.json file but could not retrieve it.';
        }
        if(type == 'summary' && okToValidate && (assetlinks.serverError || assetlinks.badContentType || assetlinks.invalidJSON || 
            assetlinks.invalidPackageName || assetlinks.invalidRelation || assetlinks.invalidNamespace ||
            assetlinks.invalidSHA)){
            if(itemRequested == 'divClass') return $scope.divClassForValue(undefined);
            return 'We retrived your assetlinks.json file at ' + assetlinks.location + ' but it did not pass every test.';
        }
        if(type == 'summary' && okToValidate && !assetlinks.serverError && !assetlinks.badContentType && !assetlinks.invalidJSON && 
            !assetlinks.invalidPackageName && !assetlinks.invalidRelation && !assetlinks.invalidNamespace &&
            !assetlinks.invalidSHA){
            if(itemRequested == 'divClass') return $scope.divClassForValue(false);
            return 'We retrived your assetlinks.json file at ' + assetlinks.location + ' and it validated successfully.';
        }
        // server error check
        if(type == 'serverError' && !okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Server error check did not run';
        }
        else if(type == 'serverError' && assetlinks.serverError && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your server returned an error status code (>= 400). This includes client side and server side errors.';
        }
        else if(type == 'serverError' && !assetlinks.serverError && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your server does not return error status codes greater than 400.';
        }

        //mime type check 
        if(type == 'badContentType' && !okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Content type test did not run. Be sure to define a ‘content-type’ header.';
        }
        else if(type == 'badContentType' && assetlinks.badContentType && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your file\'s \'content-type\' header was not found or is not set correctly.'}

        else if(type == 'badContentType' && !assetlinks.badContentType && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your file\'s \'content-type\' header is served correctly.';
        }

        //JSON parsing check

        if(type == 'invalidJSON' && !okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'JSON test did not run. Your file should contain valid JSON.';
        }
        else if(type == 'invalidJSON' && assetlinks.invalidJSON && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your file should contain valid JSON (using simple JSON.parse). This can be tripped by things like having an extraneous NULL at the end of your string.';
        }

        else if(type == 'invalidJSON' && !assetlinks.invalidJSON && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your file\'s JSON validates correctly using javascript\'s JSON.parse method.';
        }

        //Package name check
        if(type == 'invalidPackageName' && !okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Package name test did not run.';
        }
        else if(type == 'invalidPackageName' && assetlinks.invalidPackageName && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your app\'s package name was not found in your server\'s assetlinks.json file.'}

        else if(type == 'invalidPackageName' && !assetlinks.invalidPackageName && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your app\'s package name was found in your server\'s assetlinks.json file.';
        }

        //relation check
        if(type == 'invalidRelation' && (!okToValidate || assetlinks.invalidPackageName)){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(undefined);
            return 'Relation declaration test did not run because your app\'s package name was not found in your assetlinks.json\'s statements.';
        }
        else if(type == 'invalidRelation' && assetlinks.invalidRelation && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your file contains an invalid relation declaration.'
        }
        else if(type == 'invalidRelation' && !assetlinks.invalidRelation && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your file\'s relation declaration validates correctly.';
        }

        //namespace check
        if(type == 'invalidNamespace' && (!okToValidate || assetlinks.invalidPackageName)){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(undefined);
            return 'Namespace declaration test did not run because your app\'s package name was not found in your assetlinks.json\'s statements.';
        }
        else if(type == 'invalidNamespace' && assetlinks.invalidRelation && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your file contains an invalid namespace declaration.'
        }
        else if(type == 'invalidNamespace' && !assetlinks.invalidRelation && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your file\'s namespace declaration validates correctly.';
        }

        //sha 256 fingerprint check
        if(type == 'invalidSHA' && (!okToValidate || assetlinks.invalidPackageName)){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(undefined);
            return 'SHA256 cert fingerprints test did not run because your app\'s package name was not found in your server\'s assetlinks.json\'s statements.';
        }
        else if(type == 'invalidSHA' && assetlinks.invalidSHA && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(true);
            return 'Your file contains an invalid SHA256 cert fingerprint.'
        }
        else if(type == 'invalidSHA' && !assetlinks.invalidSHA && okToValidate){
            if(itemRequested == 'listGroupItemClass') return $scope.listGroupItemClassForValue(false);
            return 'Your file\'s SHA256 cert fingerprints declaration validates correctly.';
        }

        return '';
    };
    $scope.isEmpty = function(obj) {
        return obj === undefined || Object.keys(obj).length == 0;
    };
}]);
