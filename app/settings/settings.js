require('./settings.css')

module.exports = angular.module('fastflowApp.settings', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/settings', {
			templateUrl: 'settings/settings.html',
			controller: 'settingsCtrl'
		})
	}])
	.controller('settingsCtrl', ['$scope', 'defaultNav', function($scope, defaultNav) {
		$scope.$parent.setNav(defaultNav, 'Settings')

		$scope.file = ""

		$scope.test = function (){
			console.log("hello")
		}

		$scope.clickUpload = function(){
    	angular.element('#upload').trigger('click');
		};

  }])
