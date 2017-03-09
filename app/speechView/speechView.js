module.exports = angular.module('fastflowApp.speechView', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor',  'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/speechView/:tag', {
			templateUrl: 'speechView/speechView.html',
			controller: 'speechViewCtrl'
		})

		$routeProvider.when('/speechView', {
			templateUrl: 'speechView/speechView.html',
			controller: 'speechViewCtrl'
		})
	}])
	.controller('speechViewCtrl', ['$scope', '$routeParams', 'defaultNav', function($scope, $routeParams, defaultNav) {
		$scope.$on('$routeChangeStart', function(event, next, current) {
			if (next.$$route) {
				if (next.$$route.controller === "indexCtrl") {
					$scope.transitionClass = 'exitRight'
					console.log('exitLeft because indexCtrl')
				} else {
					$scope.transitionClass = 'exitLeft'
				}
			}
 		})

				$scope.none = "NONE"
				$scope.aff = "AFF"
				$scope.neg = "NEG"

				$scope.titleContent = {
					title: "",
					author: "",
					side: "NONE"
				}

				$scope.framework = "<p>Definitions:&nbsp</p><p>Framework:&nbsp</p><p>Outline:&nbsp</p>"

				$scope.points = [
					{
						tagline: "",
						content: ""
					}
				]

		if ($routeParams.tag) {
			console.log($routeParams)
			var decodedURI = decodeURIComponent($routeParams.tag)
			console.log('opening card: ' + decodedURI)
			card = ipcRenderer.sendSync('SpeechOpen', decodedURI)
			if (card == []) console.log('error, speech not found')
			mCard = JSON.parse(card)
			console.log(mCard.tagLine)
			$scope.titleContent = mCard.tagLine
			$scope.points = mCard.content
			$scope.framework = mCard.sTags
			$scope.id = mCard.$loki
		}

		$scope.$parent.setNav({
			left: [{
				icon: 'arrow_back',
				attrs: [
					{ attr: 'href', value: '#/speechManager' },
					{ attr: 'class', value: 'active' }
				]
			}],
			right: [{
				icon: 'delete',
				action: function () {$scope.deleteFunction()}
			},{
				icon: 'save',
				action: function () {$scope.saveFunction()}
			}]
		}, $scope.titleContent.title)

	}])
