require('./search.css')
module.exports = angular.module('fastflowApp.search', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/search', {
			templateUrl: 'search/search.html',
			controller: 'searchCtrl'
		})
	}])
	.controller('searchCtrl', ['$scope', 'defaultNav', function($scope, defaultNav) {
        //initialization
        //
		$scope.$on('$routeChangeStart', function(event, next, current) {
			if (next.$$route) {
				if (next.$$route.controller === "indexCtrl") {
					$scope.transitionClass = 'exitRight'
				} else {
					$scope.transitionClass = 'exitLeft'
				}
			}
 		})

		$scope.$parent.setNav(defaultNav, 'Cards')
		$('.tooltipped').tooltip({delay: 50})
        console.log($scope.dataJSON)

		$scope.URIGenerate = function(name) {
			return encodeURIComponent(name)
		}

		$('.collapsible').collapsible({
			accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		})
		$('.modal').modal()

		$scope.dataJSON = ipcRenderer.sendSync('search', 'ready')

        $scope.URIGenerate = function(name) {
            return encodeURIComponent(name)
        }


        //
        //cards//////////////////////////
        //
        //

		$scope.cardTags = Object.keys($scope.dataJSON.cards)

		$scope.openCard = function (cardID) {
			card = ipcRenderer.sendSync('FileOpen', cardID)
			if (card == []) console.log('error, card not found')
			$scope.modalCardTag = cardID
			$scope.modalCardContent = card.content
			$scope.modalCardCite = card.citation
			$('.tooltipped').tooltip({delay: 50})
			$('#cardModal').modal('open')
		}

		$scope.openMultiCard = function (tag) {
			window.location.replace('#!/cardMulti/' + $scope.URIGenerate(tag))
		}

		$scope.cardFullscreen = function () {
			$('.tooltipped').tooltip('remove')
			$('#cardModal').modal('close')
			window.location.replace('#!/card/' + $scope.URIGenerate($scope.modalCardTag))
		}
		$scope.cardDetach = function () {
			$('.tooltipped').tooltip('remove')
			$('#cardModal').modal('close')
			window.open('#!/cardDetach/' + $scope.URIGenerate($scope.modalCardTag))
		}

        //
        //speech////////////////////////////////////////////////
        //

        $('#speechModal').modal()

        $scope.speechTags = $scope.dataJSON.speeches

        //section for modal view
        $scope.titleContent
        $scope.framework
        $scope.points

        $scope.openSpeech = function(speechID) {
            card = ipcRenderer.sendSync('SpeechOpen', speechID)
            if (card == []) console.log('error, speech not found')
            mCard = JSON.parse(card)
            console.log(mCard.tagLine)
            $scope.titleContent = mCard.tagLine
            $scope.points = mCard.content
            $scope.framework = mCard.speechTags
            $scope.id = mCard.$loki
            $('.tooltipped').tooltip('remove')
            $('#speechModal').modal('open')
            $('.tooltipped').tooltip({delay: 50})
        }

        $scope.speechFullscreen = function() {
            $('#speechModal').modal('close')
            window.location.replace('#!/speech/' + $scope.URIGenerate($scope.titleContent.title))
        }
        $scope.speechDetach = function() {
            $('#speechModal').modal('close')
            window.open('#!/speechDetach/' + $scope.URIGenerate($scope.titleContent.title))
        }
        
  }])
