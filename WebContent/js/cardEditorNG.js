/* global angular */
'use strict';
var app = angular.module('cardCreator', ['textAngular']);

var socket = io.connect('http://localhost:4200');
socket.on('connect', function (data) {
    socket.emit('join', 'Hello World from client');
});

app.controller('AppCtrl', function ($scope) {
    $scope.message = "Default message";

    $scope.showInfo = false;
    $scope.info = "started";

    $scope.save = function (cardContents) {
        if ($scope.dataC && $scope.dataT && $scope.dataD) {
            $scope.showInfo = true;
            $scope.info = "Data is populated and passed required validation test";
            $scope.error = false;
            socket.emit('join', 'sending dope data');
            //send to server
            //close window
        } else {
            $scope.showInfo = true;
            $scope.info = "Data is empty but required validation passed";
            $scope.error = true;
        }
    };

});