'use strict';

/**
 * @ngdoc directive
 * @name MatchCalendarApp.directive:desktopNotificationEnabler
 * @description
 * # desktopNotificationEnabler
 */
angular.module('MatchCalendarApp')
    .directive('desktopNotificationEnabler', ['HtmlNotifications', function (HtmlNotifications) {
        return {
            restrict: 'E',
            templateUrl: 'components/Notifications/desktopNotificationEnabler.html',
            scope: {},
            link: function ($scope) {
                $scope.HtmlNotifications = HtmlNotifications;

                $scope.requestPermission = function () {
                    HtmlNotifications.requestPermission().then(function () {
                        HtmlNotifications.notify('Notifications Enabled!');
                    });
                };
            }
        };
    }]);
