module.exports = angular.module('fastflowApp.speech', ['ngRoute', 'MassAutoComplete', 'ngDragDrop',  'ngSanitize', 'angular-medium-editor',  'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/speech/:tag', {
			templateUrl: 'speech/speech.html',
			controller: 'speechCtrl'
		})

		$routeProvider.when('/speech', {
			templateUrl: 'speech/speech.html',
			controller: 'speechCtrl'
		})
	}])
	.controller('speechCtrl', ['$scope', '$routeParams', 'defaultNav', function($scope, $routeParams, defaultNav) {

		$scope.$parent.setNav(defaultNav)

		/*$scope.list1 = {title: 'AngularJS - Drag Me'};
  	$scope.list2 = {};*/

		$scope.points = [
			{
				tagline: "",
				content: ""
			}
		]

		$scope.newPoint = function() {
			$scope.points.push({
				tagline: "",
				content: ""
			})
		}

	}])
