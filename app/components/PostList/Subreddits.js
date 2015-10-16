'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.service:Subreddits
 * @description
 * # Subreddits
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('Subreddits', ['$rootScope', '$localForage', function ($rootScope, $localForage) {
        var $scope = $rootScope.$new(true);

        $scope.subreddits = [];

        $localForage.bind($scope, {
            key: 'subreddits',
            defaultValue: ['uhcmatches']
        });

        return $scope;
    }]);
