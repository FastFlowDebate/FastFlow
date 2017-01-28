module.exports = angular.module('fastflowApp.speech', ['ngRoute', 'MassAutoComplete',  'ngSanitize', 'angular-medium-editor',  'ngAnimate'])
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
		$scope.$on('$routeChangeStart', function(event, next, current) {
			if (next.$$route) {
				if (next.$$route.controller === "indexCtrl") {
					$scope.transitionClass = 'exitRight'
					console.log('exitLeft because indexCtrl')
				} else {
					$scope.transitionClass = 'exitLeft'
				}
			}
 		})

				$scope.none = "NONE"
				$scope.aff = "AFF"
				$scope.neg = "NEG"
				$scope.titleContent = {
					title: "",
					author: "",
					side: "NONE"
				}

				$scope.framework = "<p>Definitions:&nbsp</p><p>Framework:&nbsp</p><p>Outline:&nbsp</p>"

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

		$scope.$parent.setNav({
			left: [{
				icon: 'arrow_back',
				attrs: [
					{ attr: 'href', value: '#!/speechManager' },
					{ attr: 'class', value: 'active' }
				]
			}],
			right: [{
				icon: 'delete',
				action: function () {$scope.deleteFunction()}
			},{
				icon: 'save',
				action: function () {$scope.saveFunction()}
			}]
		}, $scope.titleContent.title)

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
			if($scope.titleContent.title.length > 0) {
				ipcRenderer.send('SpeechSave', card)
				Materialize.toast('Speech Saved!', 3000) // 3000 is the duration of the toast
				window.location.replace('#!/speechManager')
			}
			else {
				Materialize.toast('Speech title is empty', 3000)
			}

			$scope.saving = false
		}

		$scope.deleteFunction = function() {
			$('#deleteConfirmation').openModal();
		}

		$scope.delete = function(){
			ipcRenderer.send('SpeechRemove', $scope.id)
			window.location.replace('#!/speechManager')
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
