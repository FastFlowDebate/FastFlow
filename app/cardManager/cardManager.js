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
	.controller('cardManagerCtrl', ['$scope', 'defaultNav', function($scope, defaultNav) {
		$scope.$parent.setNav(defaultNav, 'Cards')
		jQuery('.tooltipped').tooltip({delay: 50})
		$scope.dataJSON = ipcRenderer.sendSync('CardManager', 'ready')
		$scope.sTags = Object.keys($scope.dataJSON)
		console.log($scope.sTags)
		$scope.URIGenerate = function(name) {
			return encodeURIComponent(name)
		}
		$scope.openCard = function (cardID) {
			card = ipcRenderer.sendSync('FileOpen', cardID)
			if (card == []) console.log('error, card not found')
			$scope.modalCardTag = cardID
			$scope.modalCardContent = card.content
			$scope.modalCardCite = card.citation

			$('#cardModal').openModal()
		}
		$scope.fullscreen = function () {
			$('#cardModal').closeModal()
			window.location.replace('#card/' + $scope.URIGenerate($scope.modalCardTag))
		}
  }])
