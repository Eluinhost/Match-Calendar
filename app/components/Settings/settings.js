'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('SettingsCtrl', function ($scope, NotifcationTimeFormat, $localForage, $modal, $window) {
        $scope.addSubreddit = function (name) {
            if (name === '' || name === null || name === undefined) {
                return;
            }
            if ($scope.settings.subreddits.indexOf(name) === -1) {
                $scope.settings.subreddits.push(name);
            }
        };
        $scope.removeSubreddit = function (index) {
            $scope.settings.subreddits.splice(index, 1);
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
    });
