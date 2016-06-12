const ipcRenderer = require('electron').ipcRenderer

ngApp.directive('ffcardref', function() {
	return {
		restrict: 'E',
		scope: {
			title: '=',
			deleteFunc: '&'
		},
		templateUrl: 'flow/cardRef.html',
		controller: function($scope, $element, $attrs) {
			var FileArray = ipcRenderer.sendSync('FileOpen', $scope.title)
			if (FileArray) {
				$scope.content = getCardBold(FileArray[2], '...')
			} else {
				$scope.content = '<em>Error 404 card not found</em>'
			}
		}
	}
})

function getCardBold(content, bold) {
	var i = content.indexOf('<strong>'),
		j = content.indexOf('</strong>')
	if (i !== -1 && j !== -1) {
		bold = bold + content.substring(i + 8, j) + '...'
		content = content.substring(j + 9)
		return getCardBold(content, bold)
	} else {
		return bold
	}
}
