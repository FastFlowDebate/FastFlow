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
		$scope.title
		$scope.tags
		$scope.content

    $scope.saveFunction = function () {
      var TitleString = $('#title').text()
      var TagString = $('#tags').text()
      var ContentString = $('#content').html()
      ipcRenderer.send('FileSave', [TitleString, TagString, ContentString])
      window.alert('Saved!')
    }

    $scope.deleteFunction = function () {
      var TitleString = $('#title').text()
      ipcRenderer.send('FileRemove', TitleString)
      window.alert('Deleted!')
      window.location.replace('app.html')
    }

    $scope.buttonShow = function () {
      if (!$scope.newDoc){
        $scope.showDelete = true
      }
      $scope.showSave = true
    }
  }])
