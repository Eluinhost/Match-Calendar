'use strict';

/**
 * @ngdoc function
 * @name matchCalendarApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the matchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('AuthCtrl', function ($scope, $stateParams, User, $location) {
        if(!$stateParams.error) {
            User.setDetails($stateParams.access_token, $stateParams.refresh_token, $stateParams.expires_in);

            $location.path('/');
            $location.replace();
        }

        $scope.error = $stateParams.error;
    });
