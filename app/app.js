'use strict'
var angular = require('angular')
var angularRoute = require('angular-route')

require('./index/index')
require('./flow3/flow3')
require('./flowManager/flowManager')
require('./card/card')
require('./newCard/newCard')
require('./cardManager/cardManager')
require('./cardDetatch/cardDetatch')
require('./speech/speech')
require('./speechManager/speechManager')
require('./settings/settings')




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
	'fastflowApp.cardDetatch',
	'fastflowApp.speech',
	'fastflowApp.speechManager',
	'fastflowApp.settings'
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

	$scope.$watch('nav', function() {
		console.log('hey, nav has changed!')
		console.log($scope.nav)
	})

	$scope.setNav = function (newNav, title) {
			$scope.nav = newNav
			$scope.navTitle = title
	}
	$scope.setTitle = function (title) {
			$scope.navTitle = title
	}
}])

app.directive('navside', function() {
    return {
        scope: { data: '=',
								 side: '@'
								},
        link: function(scope, elem, attrs){
					if (scope.data) {
						scope.buttons = scope.data[scope.side]
					}	else {
						//console.log('no nav data')
					}
					var oldList
					var oldDestroyFunction
					scope.$watch(function () {
						return scope.data
					}, function (newVal, oldVal) {
						if (oldVal) {
							var destroyFunction = oldVal[scope.side + 'OnDestroy'] ? oldVal[scope.side + 'OnDestroy'] : undefined
							if (typeof(destroyFunction) === 'function') {
								//console.log('calling ' + scope.side + 'OnDestroy: ' + destroyFunction)
								destroyFunction()
							} else {
								"No load function"
							}
						}
						if(newVal) {
							//console.log('changing buttons: ' + scope.side)
							scope.buttons = scope.data[scope.side]
							var loadFunction = newVal[scope.side + 'OnLoad'] ? newVal[scope.side + 'OnLoad'] : undefined
							if (typeof(loadFunction) === 'function') {
								//console.log('calling ' + scope.side + 'OnLoad: ' + loadFunction)
								scope.$applyAsync(function() {loadFunction()})
							} else {
								"No load function"
							}
						}
					}, true)
				},
				//templateUrl: "templates/navSide.html",
				template: '<navbtn ng-repeat="btn in buttons track by $index" btn="btn" ng-click="btn.action()"></navbtn>'

    }
})

app.directive('navbtn', function() {
    return {
        scope: { btn: '=' },
        link: function(scope, elem, attrs, set){
					var oldattrs
					for (var a in scope.btn.attrs) {
						elem.children('a').attr(scope.btn.attrs[a].attr, scope.btn.attrs[a].value)
					}
					oldattrs = scope.btn.attrs

					scope.$watch(function () {
						return scope.btn
					}, function (newVal) {
						if (oldattrs) {
							console.log('removing ' + oldattrs.length + ' attrs:')
							console.log(oldattrs)

							for (var a in oldattrs) {
								elem.children('a').removeAttr(oldattrs[a].attr)
							}
						}
						if (scope.btn.attrs) {
							console.log('adding ' + scope.btn.attrs.length + ' attrs:')
							console.log(scope.btn.attrs)

							for (var a in scope.btn.attrs) {
								elem.children('a').attr(scope.btn.attrs[a].attr, scope.btn.attrs[a].value)
							}
							oldattrs = scope.btn.attrs
						} else {
							oldattrs = []
						}

					}, true)
				},
				//templateUrl: "templates/navBtn.html"
				template: '<a class="navBtn"><i class="material-icons">{{btn.icon}}</i></a>'
    }
})

app.factory('navDropdown', function navDropdownFactory() {
  return {
		icon: {
			icon: 'menu',
			action: function () {
				/*jQuery('#navDropdownBtn').dropdown({
					belowOrigin: true,
					inDuration: 300,
					outDuration: 225,
					constrain_width: false, // Does not change width of dropdown to that of the activator
					hover: false, // Activate on hover
					gutter: 0, // Spacing from edge
					belowOrigin: true, // Displays dropdown below the button
					alignment: 'left' // Displays dropdown with edge aligned to the left of button
				})*/
				$('.dropdown-button').dropdown('open');
				console.log('dropdown triggered')
			},
			attrs: [
				{ attr: 'id', value: 'navDropdownBtn' },
				{ attr: 'class', value: 'dropdown-button' },
				{ attr: 'data-activates', value: 'navDropdown' }
			]
		},
		init: function () {
			console.log('initDropown')
			jQuery('nav').append("<ul id='navDropdown' class='dropdown-content'><li><a href='#' class = 'purple-text'>Home</a></li><li><a href='#cardManager' class = 'purple-text'>Cards</a></li><li><a href='#speechManager' class = 'purple-text'>Speeches</a></li><li><a class = 'grey-text'>Blocks<span class='notif green black-text'>WIP</span></a></li><li><a href='#flow' class = 'grey-text'>Flow<span class='notif green black-text'>WIP</span></a></li></ul>")
			$('.dropdown-button').dropdown()
		}, destroy: function () {
			console.log('destroyDropdown')
			$('.dropdown-button').dropdown('close');
			jQuery('#navDropdown').remove()
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
				{ attr: 'href', value: '#settings' }
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
