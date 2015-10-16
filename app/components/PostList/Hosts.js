'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.service:Hosts
 * @description
 * # Hosts
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('Hosts', ['$rootScope', '$localForage', function ($rootScope, $localForage) {
        var $scope = $rootScope.$new(true);

        $scope.favoriteHosts = [];

        $localForage.bind($scope, {
            key: 'favoriteHosts',
            defaultValue: []
        });

        return $scope;
    }]);
