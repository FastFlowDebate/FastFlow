module.exports = angular.module('fastflowApp.card', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'toaster', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/card/:tag', {
			templateUrl: 'card/card.html',
			controller: 'cardCtrl'
		})

		$routeProvider.when('/card', {
			templateUrl: 'card/card.html',
			controller: 'cardCtrl'
		})
	}])
	.controller('cardCtrl', ['$scope', 'toaster', '$routeParams', function($scope, toaster, $routeParams) {
		$scope.$parent.setNav({
			left: [{
				icon: 'arrow_back',
				attrs: [
					{ attr: 'href', value: '#/cardManager' },
				]
			}],
			right: [{
				icon: 'delete',
				action: function () {$scope.deleteFunction()}
			},{
				icon: 'save',
				action: function () {$scope.saveFunction()}
			}]
		}, 'Card Editor')

		if ($routeParams.tag) {
			var decodedURI = decodeURIComponent($routeParams.tag)
			console.log('opening card: ' + decodedURI)
			card = ipcRenderer.sendSync('FileOpen', decodedURI)
			if (card == []) console.log('error, card not found')
			$scope.title = card.tagLine
			$scope.content = card.content
			$scope.cite = card.citation
			$scope.notes = card.notes
			var t = JSON.parse(card.sTags)
			var tags = []
			for(c in t) tags.push({tag:t[c]})
			console.log(JSON.stringify(tags))
			jQuery('.chips').material_chip({
			 data: tags
		 })
		} else {
			console.log('no param, this is an error, go back to safety!')
			$scope.content = "ERROR"
			$scope.title = "ERROR"
		}

		$scope.saveFunction = function() {
			var sTags = $('.chips').material_chip('data')
			for(t in sTags) sTags[t] = sTags[t].tag //I'm sorry -Zarkoix
			var card = {tagLine:$scope.title,
									sTags:JSON.stringify(sTags),
									citation:$scope.cite,
									content:$scope.content,
									notes:$scope.notes
								}
			if (card.tagLine === "" || card.tagLine === null || card.tagLine === undefined) {
				toaster.error("Card Title is Empty", "A Card has no name...")
			} else if (card.sTags === "" || card.sTags === null || card.sTags === undefined) {
				toaster.pop('error', "Card Tags are Empty", "Tell FastFlow where to find your card!")
			} else if (card.content === "" || card.content === null || card.content === undefined) {
				toaster.pop('error', "Card has no content", "Tell FastFlow what information to remember!")
			} else {
				ipcRenderer.send('FileSave', card)
				toaster.pop('success', "Card Saved", "");
			}
		}

		$scope.deleteFunction = function() {
			$('#deleteConfirmation').openModal();
			/*
			ipcRenderer.send('FileRemove', $scope.title)
			toaster.pop('note', "Card Deleted", "");
			window.location.replace('#index')
			*/
		}
	}]).directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
});
