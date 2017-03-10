require('./index.css')

module.exports = angular.module('fastflowApp.index', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/index', {
			templateUrl: 'index/index.html',
			controller: 'indexCtrl'
		})
	}])
	// We can load the controller only when needed from an external file
	// class='dropdown-button btn' data-beloworigin="true" href='#' data-activates='dropdown1'
	.controller('indexCtrl', ['$scope', '$location', 'defaultNav', function($scope, $location, defaultNav) {
		$scope.transitionClass = 'index'
		$scope.route = "#"
		$scope.$parent.setNav(defaultNav, 'Fast Flow')

		$scope.Version = ipcRenderer.sendSync('Version')
	}])
