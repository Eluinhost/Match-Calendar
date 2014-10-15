'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.User
 * @description
 * # User
 * Factory in the MatchCalendar.
 */
angular.module('MatchCalendarApp')
    .factory('User', function ($rootScope, $localForage, $window, $state, $q, $http) {

        var profilePage = '/api/userinfo';

        var $scope = $rootScope.$new(true);

        $scope.accessToken = null;
        $scope.refreshToken = null;
        $scope.tokenExpires = null;
        $scope.profile = null;

        $localForage.bind($scope, 'accessToken');
        $localForage.bind($scope, 'refreshToken');
        $localForage.bind($scope, 'tokenExpires');

        var isAuthenticated = function() {
            return $scope.accessToken !== null;
        };

        var deauthenticate = function() {
            //TODO if token exists, invalidate with reddit

            $scope.accessToken = null;
            $scope.refreshToken = null;
            $scope.tokenExpires = null;

            $rootScope.$broadcast('auth.statusChanged');
        };

        var authenticate = function() {
            $window.location.href = '/api/auth?callback=' + encodeURIComponent($state.href('auth', {}, {absolute: true}));
        };

        var setDetails = function(accessToken, refreshToken, tokenExpires) {
            $scope.accessToken = accessToken;
            $scope.refreshToken = refreshToken;
            $scope.tokenExpires = tokenExpires;

            updateUserInfo();
        };

        var getUserInfo = function() {
            return $scope.profile;
        };

        var updateUserInfo = function() {
            var def = $q.defer();

            $http.get(profilePage + '?access_token=' + $scope.accessToken)
                .success(function(data) {
                    console.log(data);
                    $scope.profile = data;
                    $rootScope.$broadcast('auth.statusChanged');
                    def.resolve(data);
                })
                .error(function() {
                    deauthenticate();
                    def.reject();
                });
            return def.promise;
        };

        return {
            isAuthenticated: isAuthenticated,
            deauthenticate: deauthenticate,
            authenticate: authenticate,
            getUserInfo: getUserInfo,
            setDetails: setDetails
        };
    });
