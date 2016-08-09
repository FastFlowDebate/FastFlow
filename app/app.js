'use strict'
var angular = require('angular')
var angularRoute = require('angular-route')

require('./index/index')
require('./flow/flow')
require('./flowManager/flowManager')
require('./card/card')
require('./newCard/newCard')
require('./cardManager/cardManager')
require('./speech/speech')


var toaster = require('angularjs-toaster')
require('ng-dialog')
require('angular-mass-autocomplete')
require('angular-sanitize')
require('angular-animate')
var MediumEditor = require('./bower_components/medium-editor/dist/js/medium-editor').MediumEditor
require('./bower_components/angular-medium-editor/dist/angular-medium-editor')

var ngDragDrop = require('./bower_components/angular-dragdrop/src/angular-dragdrop.js')
const ipcRenderer = require('electron').ipcRenderer

angular.module('fastflowApp', [
	'ngRoute',
	'ngDialog',
	'fastflowApp.index',
	'fastflowApp.flow',
	'fastflowApp.flowManager',
	'fastflowApp.card',
	'fastflowApp.newCard',
	'fastflowApp.cardManager',
	'fastflowApp.speech'
]).config(['$routeProvider', 'ngDialogProvider', function($routeProvider, ngDialogProvider) {
  $routeProvider.otherwise({
	   redirectTo: '/index'
   })

	ngDialogProvider.setDefaults({
	 className: 'ngdialog-theme-default',
	 plain: false,
	 showClose: true,
	 closeByDocument: true,
	 closeByEscape: true,
	 appendTo: false,
	 preCloseCallback: function () {
			 console.log('default pre-close callback');
	 }
	})
}]).directive('ffcardref', function() {
	//style explanation:
	// 1 - version used in flow, short and has only the bolded text
	// 2 - version for modal, all text maintaining original formatting
	return {
		restrict: 'E',
		scope: {
			title: '=',
			deleteFunc: '&', //TODO
			style: '='
		},
		templateUrl: 'cardRef.html',
		controller: function($scope, $element, $attrs, ngDialog) {
			$scope.overlay = function () {
				var title = $scope.title
				var content = FileArray[2]
				ngDialog.open({
						template: 'cardRefModal.html',
						className: 'ngdialog-theme-default',
						controller: ['$scope', function($scope) {
        			// controller logic
							$scope.title = title
							$scope.content = content
    				}]
				});
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

angular.element().ready(function() {
	// bootstrap the app manually
	angular.bootstrap(document, ['fastflowApp']);
});




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
