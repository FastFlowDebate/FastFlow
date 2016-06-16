const ipcRenderer = require('electron').ipcRenderer
//style explanation:
// 1 - version used in flow, short and has only the bolded text
// 2 - version for modal, all text maintaining original formatting
ngApp.directive('ffcardref', function() {
	return {
		restrict: 'E',
		scope: {
			title: '=',
			deleteFunc: '&',
			style: '='
		},
		templateUrl: 'flow/cardRef.html',
		controller: function($scope, $element, $attrs) {
			$scope.overlay = function() {
				var modalEl = document.createElement('div')
				modalEl.className += " modal"
				modalEl.innerHtml = '<ffcardref style="2" title="$scope.title" class="modal card mui-panel"></ffcardref>'

					// show modal
				mui.overlay('on', modalEl)
			}

			var FileArray = ipcRenderer.sendSync('FileOpen', $scope.title)
			if (FileArray) {
				if($scope.style === 1) {
					$scope.content = getCardBold(FileArray[2], '...')
				} else if($scope.style ===2){
					$scope.content = FileArray[2]
				}
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
