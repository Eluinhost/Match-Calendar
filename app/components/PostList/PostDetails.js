'use strict';

/**
 * @ngdoc directive
 * @name MatchCalendarApp.directive:PostDetails
 * @description
 * # PostDetails
 */
angular.module('MatchCalendarApp')
    .directive('postDetails', ['DateTimeService', 'PostNotifications', 'Hosts', '$timeout', function (DateTimeService, PostNotifications, Hosts, $timeout) {
        return {
            restrict: 'E',
            scope: {
                post: '='
            },
            templateUrl: 'components/PostList/PostDetails.html',
            compile: function() {
                return {
                    pre: function ($scope) {
                        $scope.DateTime = DateTimeService;
                        $scope.Notifications = PostNotifications;

                        $scope.toggleNotification = function () {
                            PostNotifications.toggleNotifications($scope.post.id);
                        };

                        $scope.isNotifying = function () {
                            return PostNotifications.isNotifyingFor($scope.post.id);
                        };

                        $scope.toggleFavorite = function () {
                            var index = Hosts.favoriteHosts.indexOf($scope.post.author);
                            if (index === -1) {
                                Hosts.favoriteHosts.push($scope.post.author);
                            } else {
                                Hosts.favoriteHosts.splice(index, 1);
                            }
                        };

                        $scope.addressOverride = false;

                        /**
                         * Changes the address of the post to 'Copied!' for a couple of seconds
                         * @param post {MatchPost}
                         */
                        $scope.triggerCopiedMessage = function (post) {
                            // skip if there is no address
                            if (null === post.address) {
                                return;
                            }

                            // toggle copied message on
                            $scope.addressOverride = 'Copied!';
                            $scope.$broadcast('regionCopyChange');

                            // after a couple of seconds toggle it back
                            $timeout(function () {
                                $scope.addressOverride = false;
                                $scope.$broadcast('regionCopyChange');
                            }, 2000);
                        };
                    }
                };
            }
        };
    }]);
