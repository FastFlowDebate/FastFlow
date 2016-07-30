module.exports = angular.module('fastflowApp.newCard', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'toaster', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/newCard/:tag', {
			templateUrl: 'newCard/newCard.html',
			controller: 'newCardCtrl'
		})

		$routeProvider.when('/newCard', {
			templateUrl: 'newCard/newCard.html',
			controller: 'newCardCtrl'
		})
	}])
	.controller('newCardCtrl', ['$scope', 'toaster', '$routeParams', function($scope, toaster, $routeParams) {

		jQuery('.chips').material_chip({
			data: [{
				tag: 'Aff',
			}, {
				tag: 'Neg',
			}, {
				tag: 'Pro',
			}, {
				tag: 'Con',
			}],
			placeholder: 'Enter a tag',
			secondaryPlaceholder: '+Tag',
		})

		console.log('new card creator')
		$scope.content = "<i>card content from the article or pdf goes here</i>"
		$scope.notes = "<i>optional notes or analysis goes here</i>"


		$scope.saveFunction = function() {
			if ($scope.title === "" || $scope.title === null || $scope.title === undefined) {
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
	}])
