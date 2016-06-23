module.exports = angular.module('fastflowApp.card', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/card', {
			templateUrl: 'card/card.html',
			controller: 'cardCtrl'
		})
	}])
	.controller('cardCtrl', ['$scope', function($scope) {
		$scope.showSave = false
		$scope.showDelete = false
    $scope.newDoc = true

    $scope.saveFunction = function () {
			console.log('stuff: ' + $scope.title + ' ' + $scope.tags + ' ' + $scope.content)
      ipcRenderer.send('FileSave', [$scope.title, $scope.tags, $scope.content])
      window.alert('Saved!')
    }

    $scope.deleteFunction = function () {
      ipcRenderer.send('FileRemove', $scope.title)
      window.alert('Deleted!')
      window.location.replace('#index')
    }

    $scope.buttonShow = function () {
      if (!$scope.newDoc){
        $scope.showDelete = true
      }
      $scope.showSave = true
    }
  }])
