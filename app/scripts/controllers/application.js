'use strict';

/**
 * @ngdoc function
 * @name matchCalendarApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the matchCalendarApp
 */
angular.module('matchCalendarApp')
    .controller('ApplicationCtrl', [
        '$scope',
        'RedditPostsService',
        '$cookieStore',
        '$interval',
        '$timeout',
        'HtmlNotifications',
        '$anchorScroll',
        '$q',
        '$stateParams',
        'NotifcationTimeFormat',
        '$filter',
        function (
            $scope, RedditPostsService, $cookieStore,
            $interval, $timeout, HtmlNotifications,
            $anchorScroll, $q, $stateParams,
            NotifcationTimeFormat, $filter)
        {
            $scope.requestPermissions = function () {
                HtmlNotifications.requestPermission().then(function () {
                    HtmlNotifications.notify('Notifications Enabled!');
                });
            };
            $scope.currentPermission = function () {
                return HtmlNotifications.currentPermission();
            };

            $scope.toggleFavorite = function (name) {
                var index = $scope.settings.favorite_hosts.indexOf(name);
                if (index === -1) {
                    $scope.settings.favorite_hosts.push(name);
                } else {
                    $scope.settings.favorite_hosts.splice(index, 1);
                }
            };

            $scope.posts = {
                posts: [],
                filteredposts: [],
                postfilter: '',
                updating: false,
                lastUpdated: null
            };
            $scope.updatePosts = function () {
                var def = $q.defer();
                $scope.posts.updatingPosts = true;
                RedditPostsService.query($scope.settings.subreddits).then(function (data) {
                    $scope.posts.posts = data;
                    $scope.posts.updatingPosts = false;
                    $scope.posts.lastUpdated = $scope.timeOffset.currentTime();
                    def.resolve();
                });
                return def.promise;
            };

            $scope.refilter = function () {
                $scope.posts.filteredposts = $filter('filter')($scope.posts.posts, $scope.posts.postfilter);
            };
            $scope.$watch('posts.postfilter', function () {
                $scope.refilter();
            });
            $scope.$watch('posts.posts', function () {
                $scope.refilter();
            });

            /**
             * Changes the address of the post to 'Copied!' for a couple of seconds
             * @param post {MatchPost}
             */
            $scope.triggerCopiedMessage = function (post) {
                if (null == post.address)
                    return;
                var saved = post.address;
                post.address = 'Copied!';
                $timeout(function () {
                    post.address = saved;
                }, 2000);
            };

            $scope.toggleNotifications = function (postid) {
                var notify = $scope.settings.notify_for[postid];
                if (typeof notify === 'undefined') {
                    //set the last notification time to 0 to say we havn't done any
                    $scope.settings.notify_for[postid] = {value: 0};
                } else {
                    delete $scope.settings.notify_for[postid];
                }
            };

            $scope.willNotify = function (postid) {
                return typeof $scope.settings.notify_for[postid] !== 'undefined';
            };

            $scope.clockTick = function () {
                $scope.current_time = $scope.timeOffset.currentTime();
                if (HtmlNotifications.currentPermission() === 'granted') {
                    if ($scope.posts.posts.length != 0) {
                        for (var pid in $scope.settings.notify_for) {
                            if (!$scope.settings.notify_for.hasOwnProperty(pid))
                                continue;
                            (function (postid) {
                                var post = $scope.posts.posts.filter(function (mpost) {
                                    if (mpost.id === postid) {
                                        return true;
                                    }
                                });
                                //if the post no longer exists
                                if (post.length == 0) {
                                    delete $scope.settings.notify_for[postid];
                                    return;
                                }
                                angular.forEach($scope.settings.notification_times, function (notifcation_time) {
                                    var notifyTime = post[0].starts - (notifcation_time.value * 1000);
                                    if ($scope.current_time >= notifyTime) {
                                        if ($scope.settings.notify_for[postid].value < notifyTime) {
                                            var difference = post[0].starts - $scope.current_time;
                                            HtmlNotifications.notify('Game starts in ' + NotifcationTimeFormat.translateSeconds(Math.round(difference / 1000)), post[0].title);
                                            $scope.settings.notify_for[postid] = $scope.current_time;
                                        }
                                    }
                                });
                            })(pid);
                        }
                    }
                }
            };
            var clockTicker = $interval($scope.clockTick, 1000);

            $scope.scrolled = false;
            $scope.updateTick = function () {
                $scope.updatePosts().finally(function () {
                    $timeout(function () {
                        if (!$scope.scrolled) {
                            if ($stateParams.post != null)
                                document.getElementById('post-' + $stateParams.post).scrollIntoView();
                            $scope.scrolled = true;
                        }
                    });
                });
            };
            var updateTicker = $interval($scope.updateTick, 1000 * 60);
            $scope.$watchCollection('settings.subreddits', $scope.updateTick);

            $scope.$on('$destroy',function() {
                $timeout.cancel(clockTicker);
                $timeout.cancel(updateTicker);
            });
        }]);
