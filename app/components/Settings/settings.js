'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('SettingsCtrl', ['$scope', 'NotifcationTimeFormat', '$localForage', '$modal', '$window', 'Subreddits', 'DateTimeService', function ($scope, NotifcationTimeFormat, $localForage, $modal, $window, Subreddits, DateTimeService) {
        $scope.subreddits = Subreddits;
        $scope.DateTime = DateTimeService;

        $scope.addSubreddit = function (name) {
            if (name === '' || name === null || name === undefined) {
                return;
            }
            if (Subreddits.subreddits.indexOf(name) === -1) {
                Subreddits.subreddits.push(name);
            }
        };

        $scope.removeSubreddit = function (index) {
            Subreddits.subreddits.splice(index, 1);
        };

        $scope.removeNotificationTime = function (index) {
            $scope.settings.notificationTimes.splice(index, 1);
        };
        $scope.newNotificationTime = function () {
            $scope.settings.notificationTimes.push({value: 600});
        };

        $scope.translateSeconds = function (duration) {
            return NotifcationTimeFormat.translateSeconds(duration);
        };

        $scope.clearStorage = function() {
            $localForage.clear().then(
                function() {
                    $window.location.reload();
                },
                function() {
                    $modal.open({
                        template: 'Failed to clear storage. You may need to clear it manually'
                    });
                }
            );
        };
    }]);
