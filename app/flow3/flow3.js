
module.exports = angular.module('fastflowApp.flow', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/flow', {
			templateUrl: 'flow3/index.html',
			controller: 'flowCtrl'
		})
	}])
	.controller('flowCtrl', ['$scope', 'defaultNav', function($scope, defaultNav) {
		$scope.$parent.setNav(defaultNav, 'Flow3')
    $scope.dataL = []
    $scope.dataR = []
    $scope.title
    $scope.version = '0.1.2'
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

    $scope.upload = function () {
      $('#ulModal').openModal()
    }

    $scope.openFromLS = function (n) {
      var f = JSON.parse(localStorage[n]).flow3
      console.log(f)
      $scope.dataL = f.left
      $scope.dataR = f.right
      $scope.title = f.name
      $scope.isSaved = n
      $('#lsManagerModal').closeModal()
    }

    $scope.save = function () {
      if(localStorage) {
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

    $scope.download = function () {
      $scope.dlLink = makeTextFile(JSON.stringify($scope.document()))
      $('#dlModal').openModal()
    }

    $scope.document = function () {
      return {flow3: {version: $scope.version, name: $scope.title, left: $scope.dataL, right: $scope.dataR}}
    }

    $scope.lsManagerOpen = function () {
      if(localStorage){
        $('#lsManagerModal').openModal()
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
      $('#delConfirmation').openModal()
    }

    $scope.completeDelete = function () {
      console.log('deleting flow: ' + $scope.deleting)
      for(var i = $scope.deleting; i < localStorage.nF; i++) localStorage[i] = localStorage[i+1]
      localStorage[localStorage.nF] = {}
      localStorage.nF -= 1
      loadFlows()
    }
  })
  .controller('ulManager', function ulManager($scope) {
    $scope.onChange = function () {
      var input = event.target

      $scope.reader = new FileReader()
      $scope.reader.openFile = function(){
        console.log('ok 3then')
      }

      function openFile () {
        console.log('ok 2then')

      }

      $scope.reader.onload = function(){
        console.log('ok then')
        var dataURL = $scope.reader.result
        var output = document.getElementById('output')
        output.src = dataURL
      }
      $scope.reader.readAsDataURL(input.files[0])
    }
  })
  .config([
    '$compileProvider',
    function( $compileProvider )
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|blob|mailto|chrome-extension):/);
    }
  ])
  .directive('box', function() {
    return {
      restrict: 'AE',
      scope: {
        tag: '=',
        text: '=',
        type: '=',
        index: '=',
        remove: '&'
      },
      controller: function () {
        this.color = function (type) {
          if(type == 'extension') return 'blue accent-1'
          if(type == 'response') return 'red accent-1'
          if(type == 'arrow') return 'green accent-1'
          return ''
        }

        this.rm = function () {
          this.remove({index: this.index});
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
        boxes: '='
      },
      controller: function () {
        $('.tooltipped').tooltip({delay: 50})
        this.extend = function() {
          this.boxes.push({"type": "extension", "text": ""})
        }

        this.respond = function() {
          this.boxes.push({"type": "response", "text": ""})
        }

        this.arrow = function() {
          this.boxes.push({"type": "arrow"})
        }

        this.remove = function(index) {
          this.boxes.splice(index, 1)
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
        title: '='
      },
      controller: function () {
        this.newArg = function () {
          this.args.push([{"title": "", "text": "", "type": "constructive"}])
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
        data: '='
      },
      controller: function () {
        this.newContention = function() {
          this.data.push({"title": "", "args": []})
        }
      },
      controllerAs: 'f',
      bindToController: true,
      templateUrl: 'flow3/templates/flow.html'
    }
  })
