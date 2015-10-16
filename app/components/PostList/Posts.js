'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.Posts
 * @description
 * # Posts
 * Factory in the MatchCalendar.
 */
angular.module('MatchCalendarApp')
    .factory('Posts', ['$localForage', '$rootScope', 'RedditPostsService', '$q', '$interval', 'Subreddits', 'DateTimeService', function ($localForage, $rootScope, RedditPostsService, $q, $interval, Subreddits, DateTimeService) {

        var $scope = $rootScope.$new(true);
        $scope.posts = [];
        $scope.lastUpdated = 0;
        $scope.disabledRegions = [];
        $scope.disabledGamemodes = [];
        $scope.disabledTeamTypes = [];
        $scope.currentRegions = [];
        $scope.currentTeamTypes = [];
        $scope.currentGamemodes = [];
        $localForage.bind($scope, 'lastUpdated');
        $localForage.bind($scope, 'disabledRegions');
        $localForage.bind($scope, 'disabledGamemodes');
        $localForage.bind($scope, 'disabledTeamTypes');

        $scope.updating = false;
        $scope.update = function() {
            var def = $q.defer();
            $scope.updating = true;
            RedditPostsService.query(Subreddits.subreddits, 200).then(function (data) {
                $scope.posts = data;
                $scope.updating = false;
                $scope.currentRegions = readRegions(data);
                $scope.currentGamemodes = readGamemodes(data);
                $scope.currentTeamTypes = readTeamTypes(data);

                $scope.lastUpdated = DateTimeService.currentTime().unix();
                $rootScope.$broadcast('postsUpdated', $scope.posts);
                def.resolve();
            });
            return def.promise;
        };

        //update every minute
        $interval(function() {
            $scope.update();
        }, 1000 * 60);

        //watch for subreddit changes
        Subreddits.$watchCollection('subreddits', $scope.update);

        /**
         * Removes duplicates from the array case insensitive
         *
         * @param {String[]} textArray
         * @returns {String[]}
         */
        function createSetCaseInsensitive(textArray) {
            return textArray.reduce(function(acc, text) {
                var lower = text.toLowerCase();
                if (acc.lower.indexOf(lower) === -1) {
                    acc.lower.push(lower);
                    acc.actual.push(text);
                }
                return acc;
            }, {lower: [], actual: []})
            .actual;
        }

        /**
         * Fetches a list of all the regions in the post list (lowercased)
         *
         * @param {Array} posts
         * @returns {Array}
         */
        function readRegions(posts) {
            var regions = posts.map(function(post) { return post.region; });
            return createSetCaseInsensitive(regions);
        }

        /**
         * Reads a list of all the gamemodes from the post list (lowercased)
         *
         * @param {Array} posts
         * @returns {Array}
         */
        function readGamemodes(posts) {
            var gamemodes = posts.map(function(post) {
                return post.gamemodes;
            }).reduce(function(acc, gamemodes) {
                gamemodes.forEach(function(gamemode) {
                    acc.push(gamemode);
                });
                return acc;
            }, []);

            return createSetCaseInsensitive(gamemodes);
        }

        /**
         * Reads a list of all the team types from the post list (lowercased)
         *
         * @param {Array} posts
         * @returns {Array}
         */
        function readTeamTypes(posts) {
            var teamTypes = posts.map(function(post) { return post.teams; });
            return createSetCaseInsensitive(teamTypes);
        }

        $scope.isGamemodeDisabled = function(gamemeode) {
            return $scope.disabledGamemodes.indexOf(gamemeode.toLowerCase()) > -1;
        };

        $scope.isTeamTypeDisabled = function(type) {
            return $scope.disabledTeamTypes.indexOf(type.toLowerCase()) > -1;
        };

        $scope.isRegionDisabled = function(region) {
            return $scope.disabledRegions.indexOf(region.toLowerCase()) > -1;
        };

        $scope.toggleGamemode = function(gamemode) {
            gamemode = gamemode.toLowerCase();
            var index = $scope.disabledGamemodes.indexOf(gamemode);
            if (index < 0) {
                $scope.disabledGamemodes.push(gamemode);
            } else {
                $scope.disabledGamemodes.splice(index, 1);
            }
        };

        $scope.toggleTeamType = function(type) {
            type = type.toLowerCase();
            var index = $scope.disabledTeamTypes.indexOf(type);
            if (index < 0) {
                $scope.disabledTeamTypes.push(type);
            } else {
                $scope.disabledTeamTypes.splice(index, 1);
            }
        };

        $scope.toggleRegion = function(region) {
            region = region.toLowerCase();
            var index = $scope.disabledRegions.indexOf(region);
            if (index < 0) {
                $scope.disabledRegions.push(region);
            } else {
                $scope.disabledRegions.splice(index, 1);
            }
        };

        // Public return value
        return $scope;
    }]);
