/* global angular */
'use strict';
var app = angular.module('myApp', ['textAngular']);

app.controller('AppCtrl', function($scope) {
  $scope.message = "Default message";
});
