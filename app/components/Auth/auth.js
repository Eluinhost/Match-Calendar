'use strict';

/**
 * @ngdoc function
 * @name matchCalendarApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the matchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('AuthCtrl', function ($scope, $stateParams, User) {
        $scope.error = $stateParams.error;
        $scope.accessToken = $stateParams.access_token;
        $scope.refreshToken = $stateParams.refresh_token;
        $scope.expiresIn = $stateParams.expires_in;

        if(!$stateParams.error) {
            User.setDetails($stateParams.access_token, $stateParams.refresh_token, $stateParams.expires_in);
        }
    });
