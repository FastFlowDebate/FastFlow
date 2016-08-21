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
			}]
		})
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
