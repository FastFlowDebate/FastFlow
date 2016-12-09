module.exports = angular.module('fastflowApp.cardMulti', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/cardMulti/:tag', {
			templateUrl: 'cardMulti/cardMulti.html',
			controller: 'cardMultiCtrl'
		})
		$routeProvider.when('/cardMulti', {
			templateUrl: 'cardMulti/cardMulti.html',
			controller: 'cardMultiCtrl'
		})
	}])
	.controller('cardMultiCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
		$scope.x = 'y'
		if ($routeParams.tag) {
			var decodedURI = decodeURIComponent($routeParams.tag)
			console.log('fetching cards with tag: ' + decodedURI)
			$scope.multicard = ipcRenderer.sendSync('OpenCards', decodedURI)
			if ($scope.multicard == []) console.log('error, card not found')
			console.log($scope.multicard)
		} else {
			console.log('no param, this is an error, go back to safety!')
			$scope.error = true
		}
  }])
