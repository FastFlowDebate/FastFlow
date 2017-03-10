require('./flow.css')

module.exports = angular.module('fastflowApp.flow', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/flow', {
			templateUrl: 'flow3/index.html',
			controller: 'flowCtrl'
		})
	}])
	.controller('flowCtrl', ['$scope', 'navDropdown', function($scope, navDropdown) {

  }])
