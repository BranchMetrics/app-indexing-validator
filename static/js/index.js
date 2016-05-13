var app = angular.module('AppIndexingValidator', ['MainController']);

app.config(function($locationProvider) {
	$locationProvider.html5Mode({
  		enabled: true,
  		requireBase: false
	});
});