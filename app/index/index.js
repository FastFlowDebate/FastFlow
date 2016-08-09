module.exports = angular.module('fastflowApp.index', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/index', {
			templateUrl: 'index/index.html',
			controller: 'indexCtrl'
		})
	}])
	// We can load the controller only when needed from an external file
	.controller('indexCtrl', ['$scope', function($scope) {
		$scope.route = "#"
	}])
