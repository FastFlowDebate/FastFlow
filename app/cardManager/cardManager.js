$(document).ready(function(){
	$('.collapsible').collapsible({
		accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});
});

module.exports = angular.module('fastflowApp.cardManager', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/cardManager', {
			templateUrl: 'cardManager/cardManager.html',
			controller: 'cardManagerCtrl'
		})
	}])
	.controller('cardManagerCtrl', ['$scope', function($scope) {
		$scope.$parent.nav = {
			left: [{
				icon: 'menu',
				attrs: [
					{ attr: 'href', value: '#' },
				]
			}],
			right: [{
				icon: 'settings',
				attrs: [
					{ attr: 'href', value: '#' },
				]
			}]
		}

		$scope.dataJSON = ipcRenderer.sendSync('CardManager', 'ready')
		$scope.sTags = Object.keys($scope.dataJSON)
		console.log($scope.dataJSON)
		console.log($scope.sTags)


		$scope.URIGenerate = function(name) {
			console.log('encode: ' + encodeURIComponent(name))
			return encodeURIComponent(name)
		}
  }])
