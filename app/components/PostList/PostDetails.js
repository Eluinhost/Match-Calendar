'use strict';

/**
 * @ngdoc directive
 * @name MatchCalendarApp.directive:PostDetails
 * @description
 * # PostDetails
 */
angular.module('MatchCalendarApp')
    .directive('postDetails', ['DateTimeService', 'PostNotifications', function (DateTimeService, PostNotifications) {
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
                    }
                };
            }
        };
    }]);
