var app = angular.module("flowing", ['ngSanitize']);
app.controller("flowController", function($scope) {
	$scope.flow = [
		[{
			"text": "Racism is bad",
			"cards": [{
				"tag": "Yaomomoako",
				"content": "stuff like racism is bad"
			}, {
				"tag": "Isaac Lo",
				"content": "memes are the only option"
			}]
		}, {
			"text": "Bad is unjust",
			"cards": []
		}, {
			"text": "Thus we negate",
			"cards": []
		}]
	]
})

//
const ipcRenderer = require('electron').ipcRenderer

app.directive('ffcardref', function() {
	return {
		restrict: 'E',
		scope: {
			title: '@title'
		},
		templateUrl: 'flow/cardRef.html',
		controller: function($scope, $element, $attrs) {
    	$scope.title = $attrs.title
    	$scope.content = 'content'
        var FileArray = ipcRenderer.sendSync('FileOpen', $scope.title)
        $scope.title = FileArray[0]
        $scope.content = FileArray[2]
    }
	}
})
