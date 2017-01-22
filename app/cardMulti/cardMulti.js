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
		$scope.$parent.setNav({
			left: [{
				icon: 'arrow_back',
				attrs: [
					{ attr: 'href', value: '#!/cardManager' },
					{ attr: 'class', value: 'active' }
				]
			}],
			right: []
		}, $routeParams.tag)

		if ($routeParams.tag) {
			var decodedURI = decodeURIComponent($routeParams.tag)
			$scope.multicard = ipcRenderer.sendSync('OpenCards', decodedURI)
			if ($scope.multicard == []) console.log('error, card not found')
		} else {
			console.log('no param, this is an error, go back to safety!')
			$scope.error = true
		}

		$scope.URIGenerate = function (name) {
			return encodeURIComponent(name)
		}
		$scope.url = function (name) {
			return '#!/card/' + $scope.URIGenerate(name)
		}
  }])
