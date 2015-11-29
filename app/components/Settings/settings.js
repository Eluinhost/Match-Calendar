'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .controller('SettingsCtrl', ['$scope', 'NotifcationTimeFormat', '$localForage', '$uibModal', '$window', 'Subreddits', 'DateTimeService', 'PostNotifications',
        function ($scope, NotifcationTimeFormat, $localForage, $uibModal, $window, Subreddits, DateTimeService, PostNotifications) {
        $scope.subreddits = Subreddits;
        $scope.DateTime = DateTimeService;
        $scope.PostNotifications = PostNotifications;

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
            PostNotifications.settings.notificationTimes.splice(index, 1);
        };
        $scope.newNotificationTime = function () {
            PostNotifications.settings.notificationTimes.push({value: 600});
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
                    $uibModal.open({
                        template: 'Failed to clear storage. You may need to clear it manually'
                    });
                }
            );
        };
    }]);
