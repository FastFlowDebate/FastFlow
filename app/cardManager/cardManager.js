module.exports = angular.module('fastflowApp.cardManager', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/cardManager', {
			templateUrl: 'cardManager/cardManager.html',
			controller: 'cardManagerCtrl'
		})
	}])
	.controller('cardManagerCtrl', ['$scope', function($scope) {
			$scope.dataJSON = ipcRenderer.sendSync('FileManager', 'ready')

			$scope.hideList = Array.apply(null, Array($scope.dataJSON[0].length)).map(function (x, i) { return true });

			$scope.hideToggle = function(value) {
				$scope.hideList[value] = !$scope.hideList[value];
			}

			$scope.URIGenerate = function(name) {
				return "card.html?" + encodeURIComponent(name)
			}
  }])
