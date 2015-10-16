'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.service:SchemaVersion
 * @description
 * # SchemaVersion
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('SchemaVersion', ['$rootScope', '$localForage', function ($rootScope, $localForage) {
        const current = 3;

        var $scope = $rootScope.$new(true);

        $scope.schemaVersion = current;

        $localForage.bind($scope, {
            key: 'schemaVersion',
            defaultValue: 3
        });

        return $scope;
    }]);
