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
		$scope.$parent.nav = {
			left: [{
				icon: 'menu',
				attrs: [
	        { attr: 'class', value: 'dropdown-button z-depth-0' },
	        { attr: 'data-beloworigin', value: 'true' },
					{ attr: 'data-activates', value: 'dropdown1' },
					{ attr: 'href', value: '#!' },
					{ attr: 'data-constrainwidth', value: 'false' }
	    	]
			}],
			right: [{
				icon: 'settings',
				attrs: [
					{ attr: 'hreh', value: '#'}
				]
			}]
		}
	}])
