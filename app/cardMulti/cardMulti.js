module.exports = angular.module('fastflowApp.cardMulti', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/cardMulti/:tag', {
			templateUrl: 'cardMulti/cardMulti.html',
			controller: 'cardMultiCtrl'
		})
		$routeProvider.when('/cardMulti', {
			templateUrl: 'cardMulti/cardMulti.html',
			controller: 'cardMultiCtrl'
		})
	}])
	.controller('cardMultiCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
		$scope.x = 'y'
  }])
