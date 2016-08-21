module.exports = angular.module('fastflowApp.flowManager', ['ngRoute', 'ngSanitize'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/flowManager', {
			templateUrl: 'flowManager/flowManager.html',
			controller: 'flowManagerCtrl'
		})
	}])
	// We can load the controller only when needed from an external file
	.controller('flowManagerCtrl', ['$scope', function($scope) {
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
			}]
		})
		$scope.dataJSON = ipcRenderer.send('FlowManager', 'ready')

/*
	$scope.newContention = function() {
			var arrayContent = []
			for (i = 0; i < $scope.flow[0].length; i++) {
					arrayContent.push({'text': '','cards': []});
			};
			$scope.flow.push(arrayContent);
    };
*/
}])
