'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.Posts
 * @description
 * # Posts
 * Factory in the MatchCalendar.
 */
angular.module('MatchCalendarApp')
    .factory('Posts', function ($localForage, $rootScope, RedditPostsService, $q, $interval) {

        var $scope = $rootScope.$new(true);
        $scope.posts = [];
        $scope.lastUpdated = 0;
        $scope.regions = {};
        $scope.gamemodes = {};
        $scope.currentRegions = [];
        $localForage.bind($scope, 'lastUpdated');
        $localForage.bind($scope, 'regions');
        $localForage.bind($scope, 'gamemodes');

        $scope.updating = false;
        $scope.update = function() {
            var def = $q.defer();
            $scope.updating = true;
            RedditPostsService.query($rootScope.settings.subreddits, 200).then(function (data) {
                $scope.posts = data;
                $scope.updating = false;
                $scope.currentRegions = [];
                $scope.currentGamemodes = [];
                var trackedLowercaseGamemodes = [];
                angular.forEach($scope.posts, function (element) {
                    element.region = element.region || 'Unknown';
                    if($scope.currentRegions.indexOf(element.region) === -1) {
                        $scope.currentRegions.push(element.region);
                    }
                    if (!angular.isDefined($scope.regions[element.region])) {
                        $scope.regions[element.region] = true;
                    }
                    element.gamemodes.forEach(function(gamemode) {
                        var lower = gamemode.toLowerCase();
                        if (trackedLowercaseGamemodes.indexOf(lower) === -1) {
                            trackedLowercaseGamemodes.push(lower);
                            $scope.currentGamemodes.push(gamemode);
                        }
                        if (!angular.isDefined($scope.gamemodes[lower])) {
                            $scope.gamemodes[lower] = true;
                        }
                    });
                });

                $scope.lastUpdated = $rootScope.T.currentTime().unix();
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
        $rootScope.$watchCollection('settings.subreddits', $scope.update);

        // Public return value
        return $scope;
    });
