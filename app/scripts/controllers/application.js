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
                var index = $scope.settings.favoriteHosts.indexOf(name);
                if (index === -1) {
                    $scope.settings.favoriteHosts.push(name);
                } else {
                    $scope.settings.favoriteHosts.splice(index, 1);
                }
            };

            $scope.posts = {
                posts: [],
                filtered: [],
                postfilter: '',
                updating: false,
                lastUpdated: null,
                regions: {},
                filterPosts: function(element) {
                    return $scope.posts.regions[element.region || 'Unknown']
                }
            };
            $scope.updatePosts = function () {
                var def = $q.defer();
                $scope.posts.updatingPosts = true;
                RedditPostsService.query($scope.settings.subreddits).then(function (data) {
                    $scope.posts.posts = data;
                    $scope.posts.updatingPosts = false;
                    $scope.posts.lastUpdated = $scope.timeOffset.currentTime();
                    angular.forEach($scope.posts.posts, function(element) {
                        element.region = element.region || 'Unknown';
                        if(!angular.isDefined($scope.posts.regions[element.region])) {
                            $scope.posts.regions[element.region] = true;
                        }
                    });
                    def.resolve();
                });
                return def.promise;
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

            $scope.checkNotificationForPostId = function(postid) {
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
                    if ($scope.currentTime >= notifyTime) {
                        if ($scope.settings.notifyFor[postid].value < notifyTime) {
                            var difference = post[0].starts - $scope.currentTime;
                            HtmlNotifications.notify('Game starts in ' + NotifcationTimeFormat.translateSeconds(Math.round(difference / 1000)), post[0].title);
                            $scope.settings.notifyFor[postid] = $scope.currentTime;
                        }
                    }
                });
            };

            $scope.clockTick = function () {
                $scope.currentTime = $scope.timeOffset.currentTime();
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
            };
            var clockTicker = $interval($scope.clockTick, 1000);

            $scope.scrolled = false;
            $scope.updateTick = function () {
                $scope.updatePosts().finally(function () {
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
            };
            var updateTicker = $interval($scope.updateTick, 1000 * 60);
            $scope.$watchCollection('settings.subreddits', $scope.updateTick);

            $scope.$on('$destroy',function() {
                $timeout.cancel(clockTicker);
                $timeout.cancel(updateTicker);
            });
        }]);
