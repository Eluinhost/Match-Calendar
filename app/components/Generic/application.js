'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('ApplicationCtrl', function ($scope) {
        $scope.currentTime = $scope.T.currentTime();
        $scope.$on('clockTick', function(current) {
            $scope.currentTime = current;
        });
    });
