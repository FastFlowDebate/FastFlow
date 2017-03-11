var angular = require('angular')
var angularRoute = require('angular-route')

require('materialize-css/dist/css/materialize.css')
require('./fonts/iconfont/material-icons.css')
require('./css/style.css')

require('./index/index')
require('./card/card')
require('./newCard/newCard')
require('./cardManager/cardManager')
require('./cardDetach/cardDetach')
require('./speech/speech')
require('./speechView/speechView')
require('./speechManager/speechManager')
require('./speechDetach/speechDetach')
require('./flow3/flow3')

require('./settings/settings')

var $ = require('jquery')
require('materialize-css/dist/js/materialize.js')

require('angular-mass-autocomplete')
require('angular-sanitize')
require('angular-animate')
require('angular-medium-editor')


global.ipcRenderer = require('electron').ipcRenderer

var app = angular.module('fastflowApp', [
	'ngRoute',
	'ngAnimate',
	'fastflowApp.index',
	'fastflowApp.flow',
	'fastflowApp.card',
	'fastflowApp.newCard',
	'fastflowApp.cardManager',
	'fastflowApp.cardDetach',
	'fastflowApp.speech',
	'fastflowApp.speechView',
	'fastflowApp.speechManager',
  'fastflowApp.speechDetach',
	'fastflowApp.settings'

]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
	   redirectTo: '/index'
   })
}])

app.controller('navbar', ['$scope', '$routeParams', '$timeout', function($scope, $routeParams, $timeout) {

	$scope.$watch('nav', function() {
		//console.log('hey, nav has changed!')
		//console.log($scope.nav)
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
							//console.log('removing ' + oldattrs.length + ' attrs:')
							//console.log(oldattrs)

							for (var a in oldattrs) {
								elem.children('a').removeAttr(oldattrs[a].attr)
							}
						}
						if (scope.btn.attrs) {
							//console.log('adding ' + scope.btn.attrs.length + ' attrs:')
							//console.log(scope.btn.attrs)

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
				$('.dropdown-button').dropdown('open');
				//console.log('dropdown triggered')
			},
			attrs: [
				{ attr: 'id', value: 'navDropdownBtn' },
				{ attr: 'class', value: 'dropdown-button' },
				{ attr: 'data-activates', value: 'navDropdown' }
			]
		},
		init: function () {
			//console.log('initDropown')
			$('nav').append("<ul id='navDropdown' class='dropdown-content'><li><a href='#!/' class = 'purple-text'>Home</a></li><li><a href='#!/cardManager' class = 'purple-text'>Cards</a></li><li><a href='#!/speechManager' class = 'purple-text'>Speeches</a></li><li><a class = 'grey-text'>Blocks<span class='notif green black-text'>WIP</span></a></li><li><a href='#!/flow' class = 'purple-text'>Flow</a></li></ul>")
			$('.dropdown-button').dropdown()
		}, destroy: function () {
			//console.log('destroyDropdown')
			$('.dropdown-button').dropdown('close');
			$('#navDropdown').remove()
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
			icon: 'search',
			attrs: [
				{ attr: 'href', value: '' }
			]
		}]
	}
}])
