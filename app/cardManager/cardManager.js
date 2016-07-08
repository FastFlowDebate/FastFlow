module.exports = angular.module('fastflowApp.cardManager', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/cardManager', {
			templateUrl: 'cardManager/cardManager.html',
			controller: 'cardManagerCtrl'
		})
	}])
	.controller('cardManagerCtrl', ['$scope', function($scope) {
			$scope.dataJSON = ipcRenderer.sendSync('CardManager', 'ready')

			$scope.tagContent = []

			$scope.highlightList = Array.apply(null, Array($scope.dataJSON[0].length)).map(function (x, i) { return " " });

			$scope.showPanel = function(value) {
				$scope.tagContent = $scope.dataJSON[1][value];

				$scope.clearHighlightList()
				$scope.highlightList[value] = "background-color: purple; color: white;"
			}

			$scope.clearHighlightList = function() {
				$scope.highlightList = Array.apply(null, Array($scope.dataJSON[0].length)).map(function (x, i) { return " " });

			}

			$scope.URIGenerate = function(name) {
				return encodeURIComponent(name)
			}
  }])
