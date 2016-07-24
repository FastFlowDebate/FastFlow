$(document).ready(function(){
	$('.collapsible').collapsible({
		accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});
});

module.exports = angular.module('fastflowApp.cardManager', ['ngRoute','MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'toaster', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/cardManager', {
			templateUrl: 'cardManager/cardManager.html',
			controller: 'cardManagerCtrl'
		})
	}])
	.controller('cardManagerCtrl', ['$scope', function($scope) {
			$scope.dataJSON = ipcRenderer.sendSync('CardManager', 'ready')
			console.log($scope.dataJSON[1])
			$scope.tagContent = []

			$scope.URIGenerate = function(name) {
				console.log('encode: ' + encodeURIComponent(name))
				return encodeURIComponent(name)
			}

			$scope.openEditor = function(file) {
				console.log(file)
				if (file == null) {
					$scope.newDoc = true
					$scope.content = "Content:"
				} else {
			    FileArray = ipcRenderer.sendSync('FileOpen', file)
			    $scope.title = FileArray[0]
			    $scope.tags = FileArray[1]
			    $scope.content = FileArray[2]
				}
				$scope.showSave = false
				$scope.showDelete = false
				$scope.showFooter = false
				$('#card').openModal();
			}

	    $scope.saveFunction = function () {
				if($scope.title === "" || $scope.title === null || $scope.title === undefined) {
					toaster.error("Card Title is Empty", "A Card has no name...")
				} else if ($scope.tags === "" || $scope.tags === null || $scope.tags === undefined) {
					toaster.pop('error', "Card Tags are Empty", "Tell FastFlow where to find your card!")
				} else if ($scope.content === "" || $scope.content === null || $scope.title === undefined) {
					toaster.pop('error', "Card has no content", "Tell FastFlow what information to remember!")
				} else {
					ipcRenderer.send('FileSave', [$scope.title, $scope.tags, $scope.content])
					toaster.pop('success', "Card Saved", "");
				}
	    }

	    $scope.deleteFunction = function () {
	      ipcRenderer.send('FileRemove', $scope.title)
				toaster.pop('note', "Card Deleted", "");
	      window.location.replace('#index')
	    }

	    $scope.buttonShow = function () {
	      if (!$scope.newDoc){
	        $scope.showDelete = true
	      }
	      $scope.showSave = true
				$scope.showFooter = true
	    }



  }])
