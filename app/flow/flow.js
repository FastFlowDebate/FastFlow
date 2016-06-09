
var ngApp = angular.module('flowing', ['ngSanitize']);
ngApp.controller('flowController', function($scope) {


		var theURI = window.location.search

		if (theURI.length > 0) {
			$scope.newDoc = false
			var decodedURI = decodeURIComponent(theURI).substring(1).split("\\")
			FileArray = ipcRenderer.sendSync('FileOpen', decodedURI[decodedURI.length - 1])
			$scope.title = FileArray[0]
			$scope.flow = FileArray[2]
		}
		else {
			$scope.title
			$scope.newDoc = true
			$scope.flow = [
				[{
					"text": "",
					"cards": []
				}]
			]
		}

	$scope.hideDelete = true
	$scope.hideSave = true

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
		if ($scope.newDoc = false) {
			$scope.hideDelete = false
		}

	}
})

$(document).ready(function () {
  var theURI = window.location.search

  if (theURI.length > 0) {
    newDoc = false
    var decodedURI = decodeURIComponent(theURI).substring(1).split("\\")

    FileArray = ipcRenderer.sendSync('FileOpen', decodedURI[decodedURI.length - 1])

    document.getElementById('title').innerHTML = FileArray[0]
    document.getElementById('tags').innerHTML = FileArray[1]
    document.getElementById('content').innerHTML = FileArray[2]
  }
})
