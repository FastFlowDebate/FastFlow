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

	$scope.newContention = function() {
			var arrayContent = []
			for (i = 0; i < $scope.flow[0].length; i++) {
					arrayContent.push({'text': '','cards': []});
			};
			$scope.flow.push(arrayContent);
    };
	$scope.newSpeech = function() {
		for (i = 0; i < $scope.flow.length; i++) {
				$scope.flow[i].push({'text': '','cards': []});
		};

			//	r.push({'text': '','cards': []});
	};
	$scope.clearBox = function(x, y) {
			console.log(String(x) + " " + String(y))
			console.log($scope.flow[y][x])
			$scope.flow[x][y] = {'text': '','cards': []}
	};

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
