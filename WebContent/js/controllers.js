/* global angular */
'use strict';
var app = angular.module('fastFlow', ['textAngular']);

var socket = io.connect('http://localhost:4200');
socket.on('connect', function (data) {
    socket.emit('join', 'Hello World from client');
});

app.controller('cardProvider', function ($scope) {    
    $scope.tag = "memes";
    $scope.cite = "CNN/NYC/idk any other cites";
    $scope.content = "<b>this should be bolded?</b>";
});

app.controller('cardCreator', function ($scope) {
    $scope.message = "Default message";

    $scope.showInfo = false;
    $scope.info = "started";

    $scope.save = function (cardContents) {
        if ($scope.dataC && $scope.dataT && $scope.dataD) {
            $scope.showInfo = true;
            $scope.info = "Data is populated and passed required validation test";
            $scope.error = false;
            socket.emit('newCard', {
                tag: $scope.dataT,
                cite: $scope.dataC,
                data: $scope.dataD
            });
            //send to server
            //close window
        } else {
            $scope.showInfo = true;
            $scope.info = "Data is empty but required validation passed";
            $scope.error = true;
        }
    };

});

