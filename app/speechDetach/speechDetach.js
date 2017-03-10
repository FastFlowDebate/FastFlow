module.exports = angular.module('fastflowApp.speechDetach', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/speechDetach/:tag', {
			templateUrl: 'speechDetach/speechDetach.html',
			controller: 'speechDetachCtrl'
		})
	}])
	.controller('speechDetachCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
		$scope.titleContent
		$scope.framework
		$scope.points

		if ($routeParams.tag) {
            var speech = $routeParams.tag
            console.log(speech)
			card = ipcRenderer.sendSync('SpeechOpen', speech)
			if (card == []) console.log('error, speech not found')
            mCard = JSON.parse(card)
            console.log(mCard)
			$scope.titleContent = mCard.tagLine
			$scope.$parent.setNav({
				left: [],
				right: []
			}, $scope.titleContent.title)
			$scope.points = mCard.content
			$scope.framework = mCard.sTags
		} else {
			console.log('no param, this is an error, go back to safety!')
			$scope.content = "ERROR"
			$scope.title = "ERROR"
		}
	}])
