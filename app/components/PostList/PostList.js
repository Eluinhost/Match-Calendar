'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:PostListCtrl
 * @description
 * # PostListCtrl
 * Controller in MatchCalendar
 */
angular.module('MatchCalendarApp')
    .controller('PostListCtrl', function ($scope, Posts, $stateParams, HtmlNotifications, $timeout, NotifcationTimeFormat) {

        $scope.posts = Posts;

        $scope.filtered = {
            posts: [],
            filter: '',
            regionFilter: function (element) {
                return $scope.posts.regions[element.region || 'Unknown'];
            }
        };

        $scope.toggleFavorite = function (name) {
            var index = $scope.settings.favoriteHosts.indexOf(name);
            if (index === -1) {
                $scope.settings.favoriteHosts.push(name);
            } else {
                $scope.settings.favoriteHosts.splice(index, 1);
            }
        };

        /**
         * Changes the address of the post to 'Copied!' for a couple of seconds
         * @param post {MatchPost}
         */
        $scope.triggerCopiedMessage = function (post) {
            if (null === post.address) {
                return;
            }
            var saved = post.address;
            post.address = 'Copied!';
            $timeout(function () {
                post.address = saved;
            }, 2000);
        };

        $scope.requestPermissions = function () {
            HtmlNotifications.requestPermission().then(function () {
                HtmlNotifications.notify('Notifications Enabled!');
            });
        };
        $scope.currentPermission = function () {
            return HtmlNotifications.currentPermission();
        };

        $scope.$on('clockTick', function(){
            if (HtmlNotifications.currentPermission() === 'granted') {
                if ($scope.posts.posts.length !== 0) {
                    for (var pid in $scope.settings.notifyFor) {
                        if (!$scope.settings.notifyFor.hasOwnProperty(pid)) {
                            continue;
                        }
                        $scope.checkNotificationForPostId(pid);
                    }
                }
            }
        });

        $scope.toggleNotifications = function (postid) {
            var notify = $scope.settings.notifyFor[postid];
            if (typeof notify === 'undefined') {
                //set the last notification time to 0 to say we havn't done any
                $scope.settings.notifyFor[postid] = {value: 0};
            } else {
                delete $scope.settings.notifyFor[postid];
            }
        };

        $scope.willNotify = function (postid) {
            return typeof $scope.settings.notifyFor[postid] !== 'undefined';
        };

        $scope.checkNotificationForPostId = function (postid) {
            var post = $scope.posts.posts.filter(function (mpost) {
                if (mpost.id === postid) {
                    return true;
                }
            });
            //if the post no longer exists
            if (post.length === 0) {
                delete $scope.settings.notifyFor[postid];
                return;
            }
            angular.forEach($scope.settings.notificationTimes, function (notifcationTime) {
                var notifyTime = post[0].starts - (notifcationTime.value * 1000);
                var currentTime = $scope.T.currentTime();
                if (currentTime >= notifyTime) {
                    if ($scope.settings.notifyFor[postid].value < notifyTime) {
                        var difference = post[0].starts - currentTime;
                        HtmlNotifications.notify('Game starts in ' + NotifcationTimeFormat.translateSeconds(Math.round(difference / 1000)), post[0].title);
                        $scope.settings.notifyFor[postid] = currentTime;
                    }
                }
            });
        };

        //handle 'anchor' links to specific posts
        $scope.scrolled = false;
        $scope.$on('postsUpdated', function() {
            $timeout(function () {
                if (!$scope.scrolled) {
                    if ($stateParams.post !== null) {
                        var element = document.getElementById('post-' + $stateParams.post);
                        if (element !== null) {
                            element.scrollIntoView();
                        }
                    }
                    $scope.scrolled = true;
                }
            });
        });
    });
