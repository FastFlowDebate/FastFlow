var ngApp = angular.module('flowing', ['ngSanitize']);
ngApp.controller('flowController', function($scope) {

	$scope.title

	$scope.newDoc = true

	$scope.hide = true

	$scope.flow = [
		[{
			"text": "",
			"cards": []
		}]
	]

	$scope.newContention = function() {
			var arrayContent = []
			for (i = 0; i < $scope.flow[0].length; i++) {
					arrayContent.push({'text': '','cards': []})
			}
			$scope.flow.push(arrayContent);
    }

	$scope.newSpeech = function() {
		for (i = 0; i < $scope.flow.length; i++) {
				$scope.flow[i].push({'text': '','cards': []})
		}
			//	r.push({'text': '','cards': []});
	}

	$scope.clearBox = function(x, y) {
			console.log(String(x) + " " + String(y))
			console.log($scope.flow[y][x])
			$scope.flow[y][x] = {'text': '','cards': []}
	}

	$scope.saveFunction = function() {
	  var TitleString = $scope.title
	  var TagString = "default"
	  var ContentString = $scope.flow
	  ipcRenderer.send('FlowSave', [TitleString, TagString, ContentString])
	  console.log(TitleString)
	  console.log(TagString)
	  console.log(ContentString)
	  window.alert('Saved!')
	}

	$scope.deleteFunction = function() {
		var TitleString = $scope.title
	  ipcRenderer.send('FlowRemove', TitleString)
	  window.alert('Deleted!')
		window.location.replace('flowManager.html');
	}

	$scope.unHide = function() {
		$scope.hideSave = false
		if (!newDoc) {
			$scope.hideDelete = false
		}
	}
})
