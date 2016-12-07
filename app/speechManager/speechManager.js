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
	.controller('speechManagerCtrl', ['$scope', 'defaultNav', '$route', function($scope, defaultNav, $route) {
		$scope.$on('$routeChangeStart', function(event, next, current) {
			if (next.$$route) {
				if (next.$$route.controller === "indexCtrl") {
					$scope.transitionClass = 'exitRight'
					console.log('exitLeft because indexCtrl')
				} else {
					$scope.transitionClass = 'exitLeft'
				}
			}
 		})
		$scope.transitionClass = 'SpeechManager'
		$scope.$parent.setNav(defaultNav, 'Speech')
		$scope.dataJSON = ipcRenderer.sendSync('SpeechManager', 'ready')
		$scope.sTags = $scope.dataJSON
		//console.log($scope.sTags)
		$scope.URIGenerate = function(name) {
			return encodeURIComponent(name)
		}
  }])
