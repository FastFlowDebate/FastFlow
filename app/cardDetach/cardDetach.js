module.exports = angular.module('fastflowApp.cardDetach', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/cardDetach/:tag', {
			templateUrl: 'cardDetach/cardDetach.html',
			controller: 'cardDetachCtrl'
		})
	}])
	.controller('cardDetachCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
		if ($routeParams.tag) {
			var decodedURI = decodeURIComponent($routeParams.tag)
			card = ipcRenderer.sendSync('FileOpen', decodedURI)
			if (card == []) console.log('error, card not found')
			$scope.title = card.tagLine
			$scope.$parent.setNav({
				left: [],
				right: []
			}, $scope.title)
			$scope.content = card.content
			$scope.cite = card.citation
		} else {
			console.log('no param, this is an error, go back to safety!')
			$scope.content = "ERROR"
			$scope.title = "ERROR"
		}
	}])
