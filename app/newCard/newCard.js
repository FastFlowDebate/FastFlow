require("../node_modules/medium-editor/dist/css/medium-editor.css")
require("../css/mediumEditorTheme.css")
require("./newCard.css")
module.exports = angular.module('fastflowApp.newCard', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/newCard/:tag', {
			templateUrl: 'newCard/newCard.html',
			controller: 'newCardCtrl'
		})

		$routeProvider.when('/newCard', {
			templateUrl: 'newCard/newCard.html',
			controller: 'newCardCtrl'
		})
	}])
	.controller('newCardCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
		$scope.$parent.setNav({
			left: [{
				icon: 'arrow_back',
				attrs: [
					{ attr: 'href', value: '#!/cardManager' },
				]
			}]
		}, 'Card Creator')

		jQuery('.chips').material_chip({
			data: [{
				tag: 'Aff',
			}, {
				tag: 'Neg',
			}, {
				tag: 'Pro',
			}, {
				tag: 'Con',
			}],
			placeholder: 'Enter a tag',
			secondaryPlaceholder: '+Tag',
		})

		console.log('new card creator')
		$scope.content = "<i>card content from the article or pdf goes here</i>"
		$scope.notes = "<i>optional notes or analysis goes here</i>"

		$scope.saveFunction = function() {
			var sTags = $('.chips').material_chip('data')
			for(t in sTags) sTags[t] = sTags[t].tag //I'm sorry -Zarkoix
			var card = {tagLine:$scope.title,
									sTags:JSON.stringify(sTags),
									citation:$scope.cite,
									content:$scope.content,
									notes:$scope.notes
								}
			console.log(card)
			if (card.tagLine === "" || card.tagLine === null || card.tagLine === undefined) {
				Materialize.toast("Card Title is Empty", "A Card has no name...", 2500)
			} else if (card.sTags === "" || card.sTags === null || card.sTags === undefined || card.sTags === []) {
				Materialize.toast("Card Tags are Empty", "Tell FastFlow where to find your card!", 2500)
			} else if (card.content === "" || card.content === null || card.content === undefined) {
				Materialize.toast("Card has no content", "Tell FastFlow what information to remember!", 2500)
			} else {
				ipcRenderer.send('FileSave', card)
				window.location.replace('#!/cardManager')
				Materialize.toast('Card Created!', 3000) // 4000 is the duration of the toast
			}
		}
	}])
