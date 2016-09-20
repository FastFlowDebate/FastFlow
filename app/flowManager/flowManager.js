module.exports = angular.module('fastflowApp.flowManager', ['ngRoute', 'ngSanitize'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/flowManager', {
			templateUrl: 'flowManager/flowManager.html',
			controller: 'flowManagerCtrl'
		})
	}])
	// We can load the controller only when needed from an external file
	.controller('flowManagerCtrl', ['$scope', 'defaultNav', function($scope, defaultNav) {
		$scope.$parent.setNav(defaultNav, 'Flow')
		$scope.dataJSON = ipcRenderer.send('FlowManager', 'ready')
/*
	$scope.newContention = function() {
			var arrayContent = []
			for (i = 0; i < $scope.flow[0].length; i++) {
					arrayContent.push({'text': '','cards': []});
			};
			$scope.flow.push(arrayContent);
    };
*/
}])
