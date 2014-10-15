'use strict';

/**
 * @ngdoc directive
 * @name MatchCalendarApp.directive.Login
 * @description
 * # Login
 * Directive in the MatchCalendar.
 */
angular.module('MatchCalendarApp')
    .directive('login', function ($window, $state, User) {
        return {
            templateUrl: 'components/Auth/Login.html',
            restrict: 'E',
            link: function postLink($scope, element, attrs) {
                $scope.logIn = function() {
                    $window.location.href = '/api/auth?callback=' + encodeURIComponent($state.href('auth', {}, {absolute: true}));
                };
                $scope.logOut = function() {
                    User.deauthenticate();
                };
                $scope.user = User;
            }
        };
    });
