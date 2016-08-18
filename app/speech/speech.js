module.exports = angular.module('fastflowApp.speech', ['ngRoute', 'MassAutoComplete', 'ngDragDrop', 'ngSanitize', 'ngAnimate'])
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
	.controller('speechCtrl', ['$scope', '$routeParams', function($scope, toaster, ngDragDrop, $routeParams) {

		/*$scope.list1 = {title: 'AngularJS - Drag Me'};
  	$scope.list2 = {};*/

		$scope.points = [
			{
				tagline: "",
				content: ""
			}
		]

		$scope.newPoint = function() {
			window.alert("hi")
			$scope.points.push({
				tagline: "",
				content: ""
			})
		}

	}])