/* global angular */
'use strict';
var app = angular.module('fastFlow', ['textAngular']);

var socket = io.connect('http://localhost:4200');
socket.on('connect', function (data) {
    socket.emit('join', 'Hello World from client');
});

app.controller('cardProvider', function ($scope) {    
    $scope.tag = "Low-income citizens of color are rarely urged to vote";
    $scope.cite = "Michelson 2014 [Melissa Michelson, “How to mobilize reluctant voters,” http://www.washingtonpost.com/blogs/monkey-cage/wp/2014/07/15/how-to-mobilize-reluctant-voters/, Washington Post, 15 July 2014]";
    $scope.content = "Personal contacting works to persuade people to vote regularly even though the interactions do not increase voters’ resources and have little or no impact on their underlying attitudes about public issues. It is the social interaction itself that seems to matter. These interactions appear to change reluctant citizens’ entrenched understandings of themselves as disengaged from the polity. For most Americans – and especially for low-income citizens of color – it is very rare to be contacted for the sole purpose of being urged to vote. When such an unexpected interaction occurs, it can be very meaningful.";
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

