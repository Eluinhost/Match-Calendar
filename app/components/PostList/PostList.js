'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:PostListCtrl
 * @description
 * # PostListCtrl
 * Controller in MatchCalendar
 */
angular.module('MatchCalendarApp')
    .controller('PostListCtrl', function ($scope, Posts, $stateParams, HtmlNotifications, $timeout, PostNotifications) {

        $scope.posts = Posts;
        $scope.notifications = PostNotifications;

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
            $scope.$broadcast('regionCopyChange');
            $timeout(function () {
                post.address = saved;
                $scope.$broadcast('regionCopyChange');
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
