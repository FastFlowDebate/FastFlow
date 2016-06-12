const ipcRenderer = require('electron').ipcRenderer

ngApp.directive('ffcardref', function() {
	return {
		restrict: 'E',
		scope: {
			title: '='
		},
		templateUrl: 'flow/cardRef.html',
		controller: function($scope, $element, $attrs) {
			console.log('directive called: ' + $scope.title)
      var FileArray = ipcRenderer.sendSync('FileOpen', $scope.title)
			if(FileArray){
				$scope.content = FileArray[2]
			} else {
				$scope.content = '<em>Error 404 card not found</em>'
			}
    }
	}
})
