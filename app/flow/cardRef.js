const ipcRenderer = require('electron').ipcRenderer
ngApp.directive('ffcardref', function() {
	return {
		restrict: 'E',
		scope: {
			title: '@title'
		},
		templateUrl: 'flow/cardRef.html',
		controller: function($scope, $element, $attrs) {
    	$scope.title = $attrs.title
    	$scope.content = 'content'
        var FileArray = ipcRenderer.sendSync('FileOpen', $scope.title)
        $scope.title = FileArray[0]
        $scope.content = FileArray[2]
    }
	}
})
