'use strict';

/**
 * @ngdoc function
 * @name matchCalendarApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the matchCalendarApp
 */
angular.module('matchCalendarApp')
    .controller('AuthCtrl', function ($scope, $stateParams) {
        $scope.error = $stateParams.error;
        $scope.accessToken = $stateParams.access_token;
        $scope.refreshToken = $stateParams.refresh_token;
    });
