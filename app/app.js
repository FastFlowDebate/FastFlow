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

var app = angular.module('fastflowApp', [
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
}])

app.directive('ffcardref', function() {
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

app.controller('navbar', ['$scope', '$routeParams', '$timeout', function($scope, $routeParams, $timeout) {
	$scope.$on('leftNavLoaded', function(ngRepeatFinishedEvent) {
		console.log('leftNav')
		if($scope.nav.leftOnLoad)$scope.nav.leftOnLoad()
    //you also get the actual event object
    //do stuff, execute functions -- whatever...
	})
	$scope.$on('rightNavLoaded', function(ngRepeatFinishedEvent) {
		console.log('rightNav')
		if($scope.nav.rightOnLoad)$scope.nav.rightOnLoad()

    //you also get the actual event object
    //do stuff, execute functions -- whatever...
	})
	$scope.setNav = function (newNav) {
			console.log('settingNav')
			$scope.nav = newNav
	}
}])

app.directive('dynAttr', function() {
    return {
        scope: { list: '=dynAttr' },
        link: function(scope, elem, attrs){
					console.log(attrs)
					scope.oldList = {}
					scope.$watch(function () {
						return scope.$parent.nav
					}, function (val) {
						console.log('checking dynAttr: ' + JSON.stringify(scope.list))
						var attr
						for(attr in scope.oldList){
							console.log('removing: ' + scope.oldList[attr].attr)
	            elem.removeAttr(scope.oldList[attr].attr)
	          }
						scope.oldList = scope.list
	          for(attr in scope.list){
							console.log('adding: ' + scope.list[attr].attr)
	            elem.attr(scope.list[attr].attr, scope.list[attr].value)
	          }
						scope.$emit(attrs.onFinishRender)
					}, true)
        }
    }
})

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
					/*scope.$watch(element, function (val) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender)
                })
            }
					})*/
        }
    }
})

app.factory('navDropdown', function navDropdownFactory() {
  return {
		icon: {
			icon: 'menu',
			attrs: [
				{ attr: 'href', value: '' },
				{ attr: 'id', value: 'navDropdownBtn' },
				{ attr: 'class', value: 'dropdown-button' },
				{ attr: 'data-activates', value: 'navDropdown' }
			]
		},
		init: function () {
			console.log('initDropDown')
			jQuery('#navDropdownBtn').dropdown({
				inDuration: 300,
				outDuration: 225,
				constrain_width: false, // Does not change width of dropdown to that of the activator
				hover: false, // Activate on hover
				gutter: 0, // Spacing from edge
				belowOrigin: true, // Displays dropdown below the button
				alignment: 'left' // Displays dropdown with edge aligned to the left of button
			})
		}
	}
})

app.factory('defaultNav', ['navDropdown', function (navDropdown){
	return {
		left: [navDropdown.icon],
		leftOnLoad: function () {
			navDropdown.init()
		},
		right: [{
			icon: 'settings',
			attrs: [
				{ attr: 'href', value: '#' }
			]
		}]
	}
}])

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
