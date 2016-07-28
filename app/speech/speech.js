module.exports = angular.module('fastflowApp.speech', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'toaster', 'ngAnimate'])
//'angular-dragdrop',
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
	.controller('speechCtrl', ['$scope', 'toaster', '$routeParams', function($scope, toaster, $routeParams) {
		$scope.models = {
			selected: null,
			lists: {"A": [], "B": []}
	};

	// Generate initial model
	for (var i = 1; i <= 3; ++i) {
			$scope.models.lists.A.push({label: "Item A" + i});
			$scope.models.lists.B.push({label: "Item B" + i});
	}

	// Model to JSON for demo purpose
	$scope.$watch('models', function(model) {
			$scope.modelAsJson = angular.toJson(model, true);
	}, true);
	}])
