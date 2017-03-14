require('./index.css')

module.exports = angular.module('fastflowApp.index', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/index', {
            templateUrl: 'index/index.html',
            controller: 'indexCtrl'
        })
    }])
    // We can load the controller only when needed from an external file
    .controller('indexCtrl', ['$scope', '$location', 'defaultNav', function($scope, $location, defaultNav) {
        $scope.transitionClass = 'index'
        $scope.route = "#"
        $scope.$parent.setNav(defaultNav, 'Fast Flow')
				$('.tooltipped').tooltip({delay: 50})

        $scope.goto = function(route) {
            switch (route) {
                case 'card':
										$location.url('/newCard')
                    break;
                case 'speech':
										$location.url('/speech')
                    break;
                case 'settings':
										$location.url('/settings')
            }
						$('.tooltipped').tooltip('remove')
        }
        $scope.Version = ipcRenderer.sendSync('Version')
    }])
