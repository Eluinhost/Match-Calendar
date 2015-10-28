'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:PostListCtrl
 * @description
 * # PostListCtrl
 * Controller in MatchCalendar
 */
angular.module('MatchCalendarApp')
    .controller('PostListCtrl', ['$scope', 'Posts', '$stateParams', 'HtmlNotifications', '$timeout', 'PostNotifications', 'DateTimeService', 'Hosts', 'Changelog', function ($scope, Posts, $stateParams, HtmlNotifications, $timeout, PostNotifications, DateTimeService, Hosts, Changelog) {

        $scope.posts = Posts;
        $scope.DateTime = DateTimeService;
        $scope.notifications = PostNotifications;
        $scope.Hosts = Hosts;
        $scope.Changelog = Changelog;
        $scope.showFilters = false;

        $scope.buttonEnabledClass = function(enabled) {
            return enabled ? 'btn-success' : 'btn-danger';
        };

        $scope.filtered = {
            posts: [],
            filters: {
                search: '',
                region: function (post) {
                    // check if it's region is set to show or not
                    return Posts.disabledRegions.indexOf(post.region.toLowerCase()) < 0;
                },
                gamemode: function (post) {
                    // check if all of its gamemodes are enabled or not
                    var all = true;
                    for (var i = 0; i < post.gamemodes.length; i++) {
                        if (Posts.disabledGamemodes.indexOf(post.gamemodes[i].toLowerCase()) >= 0) {
                            all = false;
                        }
                    }
                    return all;
                },
                teamType: function(post) {
                    return Posts.disabledTeamTypes.indexOf(post.teams.toLowerCase()) < 0;
                }
            }
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
                            element.click();
                        }
                    }
                    $scope.scrolled = true;
                }
            });
        });
    }]);
