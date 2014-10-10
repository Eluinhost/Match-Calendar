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
        $localForage.bind($scope, 'posts');
        $localForage.bind($scope, 'lastUpdated');
        $localForage.bind($scope, 'regions');

        $scope.updating = false;
        $scope.update = function() {
            var def = $q.defer();
            $scope.updating = true;
            RedditPostsService.query($rootScope.settings.subreddits).then(function (data) {
                $scope.posts = data;
                $scope.updating = false;
                angular.forEach($scope.posts, function (element) {
                    element.region = element.region || 'Unknown';
                    if (!angular.isDefined($scope.regions[element.region])) {
                        $scope.regions[element.region] = true;
                    }
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
