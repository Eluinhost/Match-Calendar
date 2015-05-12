'use strict';

/**
 * @ngdoc directive
 * @name MatchCalendarApp.directive:PostDetails
 * @description
 * # PostDetails
 */
angular.module('MatchCalendarApp')
    .directive('postDetails', ['DateTimeService', 'PostNotifications', 'Hosts', function (DateTimeService, PostNotifications, Hosts) {
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
                    }
                };
            }
        };
    }]);
