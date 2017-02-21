module.exports = angular.module('fastflowApp.speechDetach', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/speechDetach/:tag', {
			templateUrl: 'speechDetach/speechDetach.html',
			controller: 'speechDetachCtrl'
		})
	}])
	.controller('speechDetachCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
		if ($routeParams.tag) {
            console.log($routeParams)
			var decodedURI = decodeURIComponent($routeParams.tag)
            console.log("decodedURI: " + decodedURI)
			card = ipcRenderer.sendSync('SpeechOpen', decodedURI)
			if (card == []) console.log('error, speech not found')
            mCard = JSON.parse(card)
            console.log(mCard)
			$scope.title = mCard.tagLine
			$scope.$parent.setNav({
				left: [],
				right: []
			}, $scope.title)
			$scope.content = mCard.content
			$scope.cite = mCard.citation
		} else {
			console.log('no param, this is an error, go back to safety!')
			$scope.content = "ERROR"
			$scope.title = "ERROR"
		}
	}])
