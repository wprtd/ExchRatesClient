'use strict';

const url = 'http://localhost:54930/api/';

angular.module('myApp', [
    'ngRoute',
    'myApp.currency',
    'myApp.details'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider
        .otherwise({ redirectTo: '/currency' });
}]);