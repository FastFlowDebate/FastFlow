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
	.controller('cardManagerCtrl', ['$scope', function($scope, defaultNav) {
		$scope.$parent.setNav({
			left: [{
				icon: 'block',
				attrs: [
					{ attr: 'href', value: '#/blockEditor' }
				]
			}, {
				icon: 'insert_drive_file',
				attrs: [
					{ attr: 'href', value: '#/cardManager' }
				]
			}, {
				icon: 'chat_bubble',
				attrs: [
					{ attr: 'href', value: '#/speech' }
				]
			}, {
				icon: 'view_column',
				attrs: [
					{ attr: 'href', value: '#/flowManager' }
				]
			}],
			right: [{
				icon: 'settings',
				attrs: [
					{ attr: 'href', value: '#' }
				]
			}],
			externalHTML: ["adam"]
		})
		$scope.dataJSON = ipcRenderer.sendSync('CardManager', 'ready')
		$scope.sTags = Object.keys($scope.dataJSON)
		console.log($scope.dataJSON)
		console.log($scope.sTags)


		$scope.URIGenerate = function(name) {
			console.log('encode: ' + encodeURIComponent(name))
			return encodeURIComponent(name)
		}
  }])
