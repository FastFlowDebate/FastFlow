$(document).ready(function(){
	$('.collapsible').collapsible({
		accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});
});

module.exports = angular.module('fastflowApp.speechManager', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/speechManager', {
			templateUrl: 'speechManager/speechManager.html',
			controller: 'speechManagerCtrl'
		})
	}])
	.controller('speechManagerCtrl', ['$scope', 'defaultNav', function($scope, defaultNav) {
		$scope.$parent.setNav(defaultNav, 'Speech')
		$scope.dataJSON = ipcRenderer.sendSync('SpeechManager', 'ready')
		$scope.sTags = $scope.dataJSON
		//console.log($scope.sTags)
		$scope.URIGenerate = function(name) {
			return encodeURIComponent(name)
		}
  }])
