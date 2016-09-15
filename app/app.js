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
require('./speechManager/speechManager')



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
	'fastflowApp.speech',
	'fastflowApp.speechManager'
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
			deleteFunc: '&', //todo
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
		console.log('left nav loaded')
		if($scope.nav.leftOnLoad)$scope.nav.leftOnLoad()
	})
	$scope.$on('rightNavLoaded', function(ngRepeatFinishedEvent) {
		console.log('right nav loaded')
		if($scope.nav.rightOnLoad)$scope.nav.rightOnLoad()
	})

	$scope.setNav = function (newNav, title) {
			$scope.nav = newNav
			$scope.navTitle = title
	}
	$scope.setTitle = function (title) {
			$scope.navTitle = title
	}
}])

app.directive('dynAttr', function() {
    return {
        scope: { list: '=dynAttr' },
        link: function(scope, elem, attrs){
					var oldList
					var oldDestroyFunction
					scope.$watch(function () {
						return scope.$parent.nav
					}, function (val) {
						var attr
						if(oldList){
							if(oldDestroyFunction)oldDestroyFunction()
							for(attr in oldList){
								elem.removeAttr(oldList[attr].attr)
							}
						}
						oldList = scope.list
						oldDestroyFunction = scope.$parent.nav[attrs.side + 'OnDestroy']
	          for(attr in scope.list){
	            elem.attr(scope.list[attr].attr, scope.list[attr].value)
	          }
						scope.$emit(attrs.side + 'NavLoaded')
					}, true)
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
			jQuery('nav').append("<ul id='navDropdown' class='dropdown-content'><li><a href='#cardManager' class = 'purple-text'>Cards</a></li><li><a href='#speechManager' class = 'purple-text'>Speeches</a></li><li><a class = 'grey-text'>Blocks<span class='notif green black-text'>WIP</span></a></li><li><a href='#speech' class = 'purple-text'>Speech<span class='notif green black-text'>WIP</span></a></li><li><a class = 'grey-text'>Flow<span class='notif green black-text'>WIP</span></a></li></ul>")
			jQuery('#navDropdownBtn').dropdown({
				belowOrigin: true,
				inDuration: 300,
				outDuration: 225,
				constrain_width: false, // Does not change width of dropdown to that of the activator
				hover: false, // Activate on hover
				gutter: 0, // Spacing from edge
				belowOrigin: true, // Displays dropdown below the button
				alignment: 'left' // Displays dropdown with edge aligned to the left of button
			})
		}, destroy: function () {
			console.log('destroying nav')
			jQuery('#navDropdown').remove()
			var btn = $('.dropdown-button')
			btn.unbind('click.' + btn.attr('#navDropdownBtn'))
		}
	}
})

app.factory('defaultNav', ['navDropdown', function (navDropdown){
	return {
		left: [navDropdown.icon],
		leftOnLoad: function () {
			navDropdown.init()
		},
		leftOnDestroy: function () {
			navDropdown.destroy()
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
