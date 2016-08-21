module.exports = angular.module('fastflowApp.index', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/index', {
			templateUrl: 'index/index.html',
			controller: 'indexCtrl'
		})
	}])
	// We can load the controller only when needed from an external file
	.controller('indexCtrl', ['$scope', '$location', function($scope, $location) {
		$scope.route = "#"
		$scope.$parent.setNav({
			left: [{
				icon: 'block',
				attrs: [
					{ attr: 'href', value: '#/blockEditor' }
	    	]
			}, {
				icon: 'insert_drive_file',
				attrs: [
					{ attr: 'href', value: '#/cardManager' }
	    	]
			}, {
				icon: 'chat_bubble',
				attrs: [
					{ attr: 'href', value: '#/speech' }
	    	]
			}, {
				icon: 'view_column',
				attrs: [
					{ attr: 'href', value: '#/flowManager' }
	    	]
			}],
			right: [{
				icon: 'settings',
				attrs: [
					{ attr: 'href', value: '#' }
	    	]
			}],
			externalHTML: ["adam"]
		})
	}])
