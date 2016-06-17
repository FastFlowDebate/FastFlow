var app = angular.module("flowManager", ['ngSanitize']);
const ipcRenderer = require('electron').ipcRenderer

app.controller("flowController", function($scope) {

		$scope.dataJSON = ipcRenderer.sendSync('FlowManager', 'ready')

/*
	$scope.newContention = function() {
			var arrayContent = []
			for (i = 0; i < $scope.flow[0].length; i++) {
					arrayContent.push({'text': '','cards': []});
			};
			$scope.flow.push(arrayContent);
    };
*/
})
