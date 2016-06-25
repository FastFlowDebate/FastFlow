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
				console.log($scope.hideList)
				console.log(value)
				$scope.hideList[value] = !$scope.hideList[value];
/*
				if ($scope.hideList[value] = false) {

					console.log("true now")
				} else if ($scope.hideList[value] = true){
					$scope.hideList[value] = false;
					console.log("false now")
				}
				*/
			}
  }])

/*
var app = angular.module('cardManager', []);
app.controller('myCtrl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
*/
