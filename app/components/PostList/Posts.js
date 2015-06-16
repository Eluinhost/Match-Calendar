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
        $scope.regions = {};
        $scope.gamemodes = {};
        $scope.teamTypes = {};
        $scope.currentRegions = [];
        $scope.currentTeamTypes = [];
        $scope.currentGamemodes = [];
        $localForage.bind($scope, 'lastUpdated');
        $localForage.bind($scope, 'regions');
        $localForage.bind($scope, 'gamemodes');
        $localForage.bind($scope, 'teamTypes');

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

        function defineFieldTrueIfNotExist(object, field) {
            if (!angular.isDefined(object[field])) {
                object[field] = true;
            }
        }

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
         * Fetches a list of all the regions in the post list. If a region is found we havn't seen before it's default
         * saved setting will be initialized to true.
         *
         * @param {Array} posts
         * @returns {Array}
         */
        function readRegions(posts) {
            var regions = posts.map(function(post) { return post.region; });
            var regionSet = createSetCaseInsensitive(regions);

            // make sure they're saved
            regionSet.forEach(function(region) {
                defineFieldTrueIfNotExist($scope.regions, region.toLowerCase());
            });

            return regionSet;
        }

        /**
         * Reads a list of all the gamemodes from the post list. If a gamemode is found we havn't seen before it's
         * default save setting will be initialized to true
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

            var gamemodeSet = createSetCaseInsensitive(gamemodes);
            gamemodeSet.forEach(function(gamemode) {
                defineFieldTrueIfNotExist($scope.gamemodes, gamemode.toLowerCase());
            });
            return gamemodeSet;
        }

        /**
         * Reads a list of all the team types from the post list. If a team type is found we havn't seen before it's
         * default save setting will be initialized to true
         *
         * @param {Array} posts
         * @returns {Array}
         */
        function readTeamTypes(posts) {
            var teamTypes = posts.map(function(post) { return post.teams.type.name; });
            var teamTypeSet = createSetCaseInsensitive(teamTypes);

            // make sure they're saved
            teamTypeSet.forEach(function(teamType) {
                defineFieldTrueIfNotExist($scope.teamTypes, teamType.toLowerCase());
            });

            return teamTypeSet;
        }

        // Public return value
        return $scope;
    }]);
