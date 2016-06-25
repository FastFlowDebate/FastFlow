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

			$scope.hideToggle = function(x) {
				console.log($scope.hideList)

				if ($scope.hideList[x] = false) {
					$scope.hideList[x] = true;
					console.log("true now")
				} else if ($scope.hideList[x] = true){
					$scope.hideList[x] = false;
					console.log("false now")
				}
			};
  }])

/*
var app = angular.module('cardManager', []);
app.controller('myCtrl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
*/
