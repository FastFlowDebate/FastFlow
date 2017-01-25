require('./flow.css')

module.exports = angular.module('fastflowApp.flow', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/flow', {
			templateUrl: 'flow3/index.html',
			controller: 'flowCtrl'
		})
	}])
	.controller('flowCtrl', ['$scope', 'navDropdown', function($scope, navDropdown) {
    $scope.$parent.setNav({
      left: [navDropdown.icon],
  		leftOnLoad: function () {
  			navDropdown.init()
  		},
  		leftOnDestroy: function () {
  			navDropdown.destroy()
  		},
      right: [{
        icon: 'view_module',
        action: function () {$scope.lsManagerOpen()}
      },{
        icon: 'save',
        action: function () {$scope.save()}
      }]
    }, 'Flow')
    $scope.dataL = []
		$scope.leftTeam
    $scope.dataR = []
		$scope.rightTeam
    $scope.title
    $scope.version = '0.2.0'
    $scope.isSaved = false

    if(localStorage){
      if(localStorage.version) {
        if(localStorage.version === $scope.version) {
          if(localStorage.nF !== 0 ){
            Materialize.toast(localStorage.nF + ' flows loaded', 3000)
          } else {
            Materialize.toast('No flows loaded', 3000)
          }
        } else {
          //handle version out of date
        }
      } else {
        localStorage.version = $scope.version
        localStorage.nF = 0
        Materialize.toast('First Load', 4000)
      }
    } else {
      console.log('flow3 requires a browser with localstorage')
    }

		$('.modal').modal()
    $scope.openFromLS = function (n) {
      var f = JSON.parse(localStorage[n]).flow3
      console.log(f)
      $scope.dataL = f.left
			$scope.leftTeam = f.leftTeam
      $scope.dataR = f.right
			$scope.rightTeam = f.rightTeam
      $scope.title = f.name
      $scope.isSaved = n
      $('#lsManagerModal').modal('close')
    }

    $scope.save = function () {
      if(localStorage) {
				console.log($scope.document())
        if($scope.isSaved) {
          localStorage[$scope.isSaved] = JSON.stringify($scope.document())
        } else {
          var n = Number(localStorage.nF) + 1
          localStorage[n] = JSON.stringify($scope.document())
          localStorage.nF = n
          $scope.isSaved = n
        }
        Materialize.toast('Saved', 4000) // 4000 is the duration of the toast
      } else {
        Materialize.toast('Needs localStorage', 4000) // 4000 is the duration of the toast
      }
    }

    $scope.document = function () {
      return {flow3: {version: $scope.version, name: $scope.title, left: $scope.dataL, leftTeam: $scope.leftTeam, right: $scope.dataR, rightTeam: $scope.rightTeam}}
    }

    $scope.lsManagerOpen = function () {
      if(localStorage){
        $('#lsManagerModal').modal('open')
      } else {
        Materialize.toast('Needs localStorage', 4000) // 4000 is the duration of the toast
      }
    }

    function makeTextFile (text) {
      var data = new Blob([text], {type: 'octet/stream'})
      return window.URL.createObjectURL(data)
    }
  }])
  .controller('lsManager', function lsManager($scope) {
    if(localStorage){
      loadFlows()
    } else {
      $scope.message = 'Browser must have localStorage for this feature to be enabled'
    }
    $('.dropdown-button').dropdown({
       inDuration: 300,
       outDuration: 225,
       constrain_width: false, // Does not change width of dropdown to that of the activator
       hover: false, // Activate on hover
       gutter: 0, // Spacing from edge
       belowOrigin: false, // Displays dropdown below the button
       alignment: 'left' // Displays dropdown with edge aligned to the left of button
     }
    )

    function loadFlows () {
      $scope.flows = []
      for(var i = 1; i <= localStorage.nF; i++){
        var f = JSON.parse(localStorage[i]).flow3
        $scope.flows.push({name: f.name, version: f.version, id: i})
      }
    }

    $scope.open = function (n) {
      console.log('trying to open flow: ' + n)
      $scope.$parent.openFromLS(n)
    }

    $scope.beginDelete = function (n) {
      $scope.deleting = n
      console.log('begin deleting flow: ' + n)
      $('#delConfirmation').modal('open')
    }

    $scope.completeDelete = function () {
      console.log('deleting flow: ' + $scope.deleting)
      for(var i = $scope.deleting; i < localStorage.nF; i++) localStorage[i] = localStorage[i+1]
      localStorage[localStorage.nF] = {}
      localStorage.nF -= 1
      loadFlows()
    }
  })
  .config([
    '$compileProvider',
    function( $compileProvider )
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob|mailto|chrome-extension):/);
    }
  ])
  .directive('box', function() {
    return {
      restrict: 'AE',
      scope: {
        tag: '=',
        text: '=',
        type: '=',
        index: '=boxindex',
        removeBox: '&boxrm'
      },
      controller: function () {
        this.color = function (type) {
          if(type == 'extension') return 'blue accent-1'
          if(type == 'response') return 'red accent-1'
          if(type == 'arrow') return 'green accent-1'
          return ''
        }

        this.rmbox = function () {
          this.removeBox({index: this.boxindex})
        }

				this.critical = false

				this.toggleCritical = function () {
					this.critical = !this.critical
				}

				this.isCritical = function () {
					if (this.critical) return 'boxCriticalBorder'
					return ''
				}

				this.getStyle = function (type) {
					return this.isCritical() + ' ' + this.color(type)
				}
      },
      controllerAs: 'b',
      bindToController: true,
      templateUrl: 'flow3/templates/box.html'
    }
  })
  .directive('arguement', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {
        boxes: '=',
				index: '=argindex',
				removeArguement: '&argrm'
      },
      controller: function () {
				console.log('tooltipped')
				$('.tooltipped').tooltip()
        this.extend = function() {
          this.boxes.push({"type": "extension", "text": ""})
        }
        this.respond = function() {
          this.boxes.push({"type": "response", "text": ""})
        }
        this.arrow = function() {
          this.boxes.push({"type": "arrow"})
        }
        this.removeBox = function(index) {
          this.boxes.splice(index, 1)
        }
				this.rmarg = function () {
					this.removeArguement({index: this.argindex})
				}
      },
      controllerAs: 'a',
      bindToController: true,
      templateUrl: 'flow3/templates/arg.html'
    }
  })
  .directive('contention', function() {
    return {
      restrict: 'E',
      scope: {
        args: '=',
        name: '='
      },
      controller: function () {
        this.newArg = function () {
          this.args.push([{"title": "", "text": "", "type": "constructive"}])
        }
				this.removeArguement = function(index) {
					this.args.splice(index, 1)
				}
      },
      controllerAs: 'c',
      bindToController: true,
      templateUrl: 'flow3/templates/contention.html'
    }
  })
  .directive('flow', function() {
    return {
      restrict: 'E',
      scope: {
        data: '=',
				id: '@',
				team: '='
      },
      controller: function () {
				this.expand = false
				this.toggleExpand = function () {
					this.expand = !this.expand
				}
				this.isExpanded = function () {
					if (this.expand) return 'flowExpanded flow'
					else return 'flow'
				}
        this.newContention = function () {
          this.data.push({"title": "", "args": []})
        }

      },
      controllerAs: 'f',
      bindToController: true,
      templateUrl: 'flow3/templates/flow.html'
    }
  })
