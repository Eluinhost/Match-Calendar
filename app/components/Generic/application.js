'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('ApplicationCtrl', ['$scope', 'DateTimeService', function ($scope, DateTimeService) {
        $scope.DateTime = DateTimeService;
    }]);
