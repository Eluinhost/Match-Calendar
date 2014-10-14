'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.User
 * @description
 * # User
 * Factory in the MatchCalendar.
 */
angular.module('MatchCalendarApp')
    .factory('User', function ($rootScope, $localForage, $window, $state) {

        var $scope = $rootScope.$new(true);

        $scope.accessToken = null;
        $scope.refreshToken = null;
        $scope.tokenExpires = null;

        $localForage.bind($scope, 'accessToken');
        $localForage.bind($scope, 'refreshToken');
        $localForage.bind($scope, 'tokenExpires');

        var isAuthenticated = function() {
            return this.accessToken !== null;
        };

        var deauthenticate = function() {
            //TODO if token exists, invalidate with reddit

            $scope.accessToken = null;
            $scope.refreshToken = null;
            $scope.tokenExpires = null;

            $rootScope.$broadcast('auth.loggedOut');
        };

        var authenticate = function() {
            $window.location.href = '/api/auth?callback=' + encodeURIComponent($state.href('auth', {}, {absolute: true}));
        };

        var setDetails = function(accessToken, refreshToken, tokenExpires) {
            $scope.accessToken = accessToken;
            $scope.refreshToken = refreshToken;
            $scope.tokenExpires = tokenExpires;

            updateUserInfo().then(function() {
                $rootScope.$broadcast('auth.loggedIn');
            });
        };

        var getUserInfo = function() {
            //TODO
        };

        var updateUserInfo = function() {
            //TODO update user details from API
        };

        return {
            isAuthenticated: isAuthenticated,
            deauthenticate: deauthenticate,
            authenticate: authenticate,
            getUserInfo: getUserInfo,
            setDetails: setDetails
        };
    });
