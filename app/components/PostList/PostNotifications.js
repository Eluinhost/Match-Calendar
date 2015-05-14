'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.PostNotifications
 * @description
 * # PostNotifications
 * Factory in the MatchCalendar.
 */
angular.module('MatchCalendarApp')
    .factory('PostNotifications', ['$localForage', '$rootScope', 'HtmlNotifications', 'Posts', 'NotifcationTimeFormat', 'DateTimeService', function ($localForage, $rootScope, HtmlNotifications, Posts, NotifcationTimeFormat, DateTimeService) {

        var $scope = $rootScope.$new(true);

        $scope.notifyFor = {};
        $localForage.bind($scope, {
            key: 'notifyFor',
            defaultValue: {}
        });

        $scope.notificationTimes = [];
        $localForage.bind($scope, {
            key: 'notificationTimes',
            defaultValue: [{value: 600}]
        });

        $scope.$on('clockTick', function(){
            if (HtmlNotifications.currentPermission() === 'granted') {
                if (Posts.posts.length !== 0) {
                    for (var pid in $scope.notifyFor) {
                        if (!$scope.notifyFor.hasOwnProperty(pid)) {
                            continue;
                        }
                        checkNotificationForPostId(pid);
                    }
                }
            }
        });

        var checkNotificationForPostId = function(postid) {
            var post = Posts.posts.filter(function (mpost) {
                if (mpost.id === postid) {
                    return true;
                }
            });
            // if the post no longer exists
            if (post.length === 0) {
                delete $scope.notifyFor[postid];
                return;
            }
            angular.forEach($scope.notificationTimes, function (notifcationTime) {
                var unix = post[0].opens.unix();
                var timeToNotify = unix - notifcationTime.value;
                var currentTimeUnix = DateTimeService.currentTime().unix();

                // if it's passed the notify time and we havn't already done a notification later than this
                if (currentTimeUnix >= timeToNotify && $scope.notifyFor[postid].value < timeToNotify) {
                    var difference = unix - currentTimeUnix;
                    HtmlNotifications.notify('Game opens in ' + NotifcationTimeFormat.translateSeconds(Math.round(difference)), post[0].title);
                    $scope.notifyFor[postid].value = currentTimeUnix;
                }
            });
        };

        var toggleNotifications = function (postid) {
            var notify = $scope.notifyFor[postid];
            if (typeof notify === 'undefined') {
                //set the last notification time to 0 to say we havn't done any
                $scope.notifyFor[postid] = {value: 0};
            } else {
                delete $scope.notifyFor[postid];
            }
        };

        var isNotifyingFor = function (postid) {
            return typeof $scope.notifyFor[postid] !== 'undefined';
        };


        // Public return value
        return {
            notifyingFor: $scope.notifyFor,
            toggleNotifications: toggleNotifications,
            isNotifyingFor: isNotifyingFor,
            settings: $scope
        };
    }]);
