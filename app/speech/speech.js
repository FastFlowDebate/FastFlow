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

		if ($routeParams.tag) {
			console.log($routeParams)
			var decodedURI = decodeURIComponent($routeParams.tag)
			console.log('opening card: ' + decodedURI)
			card = ipcRenderer.sendSync('SpeechOpen', decodedURI)
			if (card == []) console.log('error, speech not found')
			mCard = JSON.parse(card)
			console.log(mCard.tagLine)
			$scope.titleContent = mCard.tagLine
			$scope.points = mCard.content
			$scope.framework = mCard.sTags
			$scope.id = mCard.$loki
		}

		$scope.saveFunction = function() {
			if($scope.saving) return //don't let function run twice at same time
			$scope.saving = true
			var card = {
				         tagLine:$scope.titleContent,
								 sTags:$scope.framework,
							   content:$scope.points,
								 id:$scope.id
								}
		  console.log(card)
			ipcRenderer.send('SpeechSave', card)
			Materialize.toast('Speech Saved!', 3000) // 4000 is the duration of the toast
			window.location.replace('#speechManager')

			$scope.saving = false
		}

		$scope.deleteFunction = function() {
			$('#deleteConfirmation').openModal();
		}

		$scope.delete = function(){
			ipcRenderer.send('SpeechRemove', $scope.id)
			window.location.replace('#speechManager')
			$('#deleteConfirmation').closeModal();

		}

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
