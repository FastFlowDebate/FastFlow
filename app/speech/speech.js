module.exports = angular.module('fastflowApp.speech', ['ngRoute', 'MassAutoComplete', 'ngDragDrop',  'ngSanitize', 'angular-medium-editor',  'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/speech/:tag', {
			templateUrl: 'speech/speech.html',
			controller: 'speechCtrl'
		})

		$routeProvider.when('/speech', {
			templateUrl: 'speech/speech.html',
			controller: 'speechCtrl'
		})
	}])
	.controller('speechCtrl', ['$scope', '$routeParams', 'defaultNav', function($scope, $routeParams, defaultNav) {
		$scope.$parent.setNav({
			left: [{
				icon: 'arrow_back',
				attrs: [
					{ attr: 'href', value: '#/speechManager' },
				]
			}],
			right: [{
				icon: 'delete',
				action: function () {$scope.deleteFunction()}
			},{
				icon: 'save',
				action: function () {$scope.saveFunction()}
			}]
		}, 'Speech Editor')

		if ($routeParams.tag) {
			var decodedURI = decodeURIComponent($routeParams.tag)
			console.log('opening card: ' + decodedURI)
			card = ipcRenderer.sendSync('SpeechOpen', decodedURI)
			if (card == []) console.log('error, speech not found')
			$scope.titleContent = JSON.parse(card.tagLine)
			$scope.points = JSON.parse(card.content)
			$scope.framework = JSON.parse(card.sTags)
		} else {
			console.log('no param, this is an error, go back to safety!')
			$scope.content = "ERROR"
			$scope.title = "ERROR"
		}

		$scope.saveFunction = function() {
			if($scope.saving) return //don't let function run twice at same time
			$scope.saving = true
			var card = {
				         tagLine:JSON.stringify($scope.titleContent),
								 sTags:JSON.stringify($scope.framework),
							   content:JSON.stringify($scope.points)
								}

			ipcRenderer.send('SpeechSave', card)
			Materialize.toast('Speech Saved!', 3000) // 4000 is the duration of the toast
			window.location.replace('#speechManager')

			$scope.saving = false
		}

		$scope.deleteFunction = function() {
			$('#deleteConfirmation').openModal();
		}

		$scope.delete = function(){
			ipcRenderer.send('FileRemove', $scope.title)
			Materialize.toast('Card Deleted', 2500)
			window.location.replace('#index')
		}


		$scope.titleContent = {
			title: "",
			author: ""
		}
		$scope.framework = "<p>Definitions: </p><p>Framework: </p><p>Outline: </p>"

		/*$scope.list1 = {title: 'AngularJS - Drag Me'};
  	$scope.list2 = {};*/

		$scope.points = [
			{
				tagline: "",
				content: ""
			}
		]

		$scope.newPoint = function() {
			$scope.points.push({
				tagline: "",
				content: ""
			})
		}
		$scope.deletePoint = function(i) {
			console.log("deleting")
			console.log(i)
			$scope.points.splice(i, 1);
		}

	}])
