module.exports = angular.module('fastflowApp.cardManager', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/cardManager', {
			templateUrl: 'cardManager/cardManager.html',
			controller: 'cardManagerCtrl'
		})
	}])
	.controller('cardManagerCtrl', ['$scope', function($scope) {

  }])
