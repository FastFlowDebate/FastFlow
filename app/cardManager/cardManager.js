module.exports = angular.module('fastflowApp.cardManager', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/cardManager', {
			templateUrl: 'cardManager/cardManager.html',
			controller: 'cardManagerCtrl'
		})
	}])
	.controller('cardManagerCtrl', ['$scope', function($scope) {
			$scope.dataJSON = ipcRenderer.sendSync('FileManager', 'ready')
  }])

/*
var app = angular.module('cardManager', []);
app.controller('myCtrl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
*/
