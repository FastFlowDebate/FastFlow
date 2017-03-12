require('../node_modules/medium-editor/dist/css/medium-editor.css')
require('../css/mediumEditorTheme.css')
require('./speech.css')
module.exports = angular.module('fastflowApp.speech', ['ngRoute', 'MassAutoComplete', 'ngSanitize', 'angular-medium-editor', 'ngAnimate'])
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
        $('#deleteConfirmation').modal()

        $scope.none = "NONE"
        $scope.aff = "AFF"
        $scope.neg = "NEG"
        $scope.titleContent = {
            title: "",
            author: "",
            side: "NONE"
        }
				$scope.preflow = {}
        $scope.preflow.data = []
				$scope.preflow.name = ""
        $scope.framework = "<p>Definitions:&nbsp</p><p>Framework:&nbsp</p><p>Outline:&nbsp</p>"
        $scope.points = [{
            tagline: "",
            content: ""
        }]

        if ($routeParams.tag) {
            console.log($routeParams)
            var decodedURI = decodeURIComponent($routeParams.tag)
            console.log('opening speech: ' + decodedURI)
            speech = ipcRenderer.sendSync('SpeechOpen', decodedURI)
            if (speech == []) console.log('error, speech not found')
            mSpeech = JSON.parse(speech)
            console.log(mSpeech.tagLine)
            $scope.titleContent = mSpeech.tagLine
            $scope.points = mSpeech.content
            $scope.framework = mSpeech.sTags
						if (mSpeech.preflow) $scope.preflow = mSpeech.preflow
            $scope.id = mSpeech.$loki
        }

        $scope.$parent.setNav({
            left: [{
                icon: 'arrow_back',
                attrs: [{
                        attr: 'href',
                        value: '#!/speechManager'
                    },
                    {
                        attr: 'class',
                        value: 'active'
                    }
                ]
            }],
            right: [{
                icon: 'delete',
                action: function() {
                    $scope.deleteFunction()
                }
            }, {
                icon: 'save',
                action: function() {
                    $scope.saveFunction()
                }
            }]
        }, $scope.titleContent.title)

        $scope.saveFunction = function() {
            if ($scope.saving) return //don't let function run twice at same time
            $scope.saving = true
            var speech = {
                tagLine: $scope.titleContent,
                sTags: $scope.framework,
                content: $scope.points,
                id: $scope.id,
								preflow: $scope.preflow
            }
            console.log(speech)
            if ($scope.titleContent.title.length > 0) {
                ipcRenderer.send('SpeechSave', speech)
                Materialize.toast('Speech Saved!', 3000) // 3000 is the duration of the toast
                window.location.replace('#!/speechManager')
            } else {
                Materialize.toast('Speech title is empty', 3000)
            }

            $scope.saving = false
        }

        $scope.deleteFunction = function() {
            $('#deleteConfirmation').modal('open')
        }

        $scope.delete = function() {
            ipcRenderer.send('SpeechRemove', $scope.id)
            window.location.replace('#!/speechManager')
            $('#deleteConfirmation').modal('close')

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
            controller: function() {
                this.color = function(type, critical) {
                    var style = ''
                    if (type == 'extension') style = 'blue'
                    if (type == 'response') style = 'red'
                    if (type == 'arrow') style = 'green'
                    if (critical) {
                        style += ' boxCriticalBorder'
                    } else {
                        style += ' accent-1'
                    }
                    return style
                }
                this.rmbox = function() {
                    this.removeBox({
                        index: this.index
                    })
                }
                this.critical = false
                this.toggleCritical = function() {
                    this.critical = !this.critical
                }
                this.isCritical = function() {
                    if (this.critical) return 'boxCriticalBorder'
                    return ''
                }
                this.getStyle = function(type) {
                    return this.color(type, this.isCritical())
                }
            },
            controllerAs: 'b',
            bindToController: true,
            templateUrl: 'speech/templates/box.html'
        }
    })
    .directive('arguement', function() {
        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                boxes: '=',
                index: '=argindex',
                removeArgument: '&argrm'
            },
            controller: function() {
                $('.tooltipped').tooltip()
                this.extend = function() {
                    this.boxes.push({
                        "type": "extension",
                        "text": ""
                    })
                }
                this.respond = function() {
                    this.boxes.push({
                        "type": "response",
                        "text": ""
                    })
                }
                this.arrow = function() {
                    this.boxes.push({
                        "type": "arrow"
                    })
                }
                this.removeBox = function(index) {
                    this.boxes.splice(index, 1)
                }
                this.rmarg = function() {
                    $('.tooltipped').tooltip('remove') //closes then reinitializes all the tooltips
                    $('.tooltipped').tooltip()
                    this.removeArgument({
                        index: this.index
                    })
                }
            },
            controllerAs: 'a',
            bindToController: true,
            templateUrl: 'speech/templates/arg.html'
        }
    })
    .directive('contention', function() {
        return {
            restrict: 'E',
            scope: {
                args: '=',
                name: '=',
                index: '=contindex',
                removeContention: '&contrm'
            },
            controller: function() {
                $('.tooltipped').tooltip()
                this.newArg = function() {
                    this.args.push([{
                        "title": "",
                        "text": "",
                        "type": "constructive"
                    }])
                }
                this.removeArgument = function(index) { //removing arguement from contention
                    this.args.splice(index, 1)
                }
                this.rmcont = function() { //remove contention called from the contention
                    $('.tooltipped').tooltip('remove')
                    $('.tooltipped').tooltip()
                    this.removeContention({
                        index: this.index
                    })
                }
            },
            controllerAs: 'c',
            bindToController: true,
            templateUrl: 'speech/templates/contention.html'
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
            controller: function() {
                this.expand = false
                this.toggleExpand = function() {
                    this.expand = !this.expand
                }
                this.isExpanded = function() {
                    if (this.expand) return 'flowExpanded flow'
                    else return 'flow'
                }
                this.newContention = function() {
                    this.data.push({
                        "title": "",
                        "args": []
                    })
                }
                this.removeContention = function(index) {
                    this.data.splice(index, 1)
                }
            },
            link: function(scope, element, attr, ctrl) {
                scope.$on('toggleExpand', function(events, args) {
                    ctrl.toggleExpand()
                })
            },
            controllerAs: 'f',
            bindToController: true,
            templateUrl: 'speech/templates/flow.html'
        }
    })
