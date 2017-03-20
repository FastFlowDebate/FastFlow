require("../node_modules/medium-editor/dist/css/medium-editor.css")
require("../css/mediumEditorTheme.css")
require("./card.css")
module.exports = angular.module('fastflowApp.card', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'ngAnimate'])
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
	.controller('cardCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
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

		if ($routeParams.tag) {
			var decodedURI = decodeURIComponent($routeParams.tag)
			card = ipcRenderer.sendSync('FileOpen', decodedURI)
            console.log(card)
			if (card == []) console.log('error, card not found')
			$scope.title = card.tagLine
			$scope.content = card.content
			$scope.cite = card.citation
			$scope.notes = card.notes
			$scope.id = card.$loki
			var t = card.sTags
			var tags = []
			for(c in t) tags.push({tag:t[c]})
			$('.chips').material_chip({
			 data: tags
		 })
		} else {
			$scope.content = "ERROR"
			$scope.title = "ERROR"
		}

		$scope.$parent.setNav({
			left: [{
				icon: 'arrow_back',
				attrs: [
					{ attr: 'href', value: '#!/cardManager' },
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
		}, $scope.title)

		$scope.saving = false
		$scope.saveFunction = function() {
			if($scope.saving) return //don't let function run twice at same time
			$scope.saving = true
			var sTags = $('.chips').material_chip('data')
			for(t in sTags) sTags[t] = sTags[t].tag //I'm sorry -Zarkoix
			var card = {tagLine:$scope.title,
									sTags:JSON.stringify(sTags),
									citation:$scope.cite,
									content:$scope.content,
									notes:$scope.notes,
									id:$scope.id
								}
			if (card.tagLine === "" || card.tagLine === null || card.tagLine === undefined) {
				Materialize.toast('Card Title is Empty', 1500)
			} else if (card.sTags === "" || card.sTags === null || card.sTags === undefined || card.sTags === []) {
				Materialize.toast('Card Tags are Empty', 1500)
			} else if (card.content === "" || card.content === null || card.content === undefined) {
				Materialize.toast('Card has no content', 1500)
			} else {
				ipcRenderer.send('FileSave', card)
				window.location.replace('#!/cardManager')
				Materialize.toast('Card Saved!', 3000) // 4000 is the duration of the toast
			}
			$scope.saving = false
		}

		$scope.deleteFunction = function() {
			$('#deleteConfirmation').openModal()
		}

		$scope.delete = function(){
			ipcRenderer.send('FileRemove', $scope.title)
			Materialize.toast('Card Deleted', 2500)
			window.location.replace('#!/index')
			$('#deleteConfirmation').closeModal()

		}
	}]).directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {
      function read() {
        ngModel.$setViewValue(element.html());
      }
      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "")
      }
      element.bind("blur keyup change", function() {
        scope.$apply(read)
      })
    }
  };
});
