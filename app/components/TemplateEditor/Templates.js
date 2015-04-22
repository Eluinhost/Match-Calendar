'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.service:Templates
 * @description
 * # Templates
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('Templates', ['$rootScope', '$localForage', function ($rootScope, $localForage) {
        var $scope = $rootScope.$new(true);

        $scope.templates = {};
        $localForage.bind($scope, 'templates');

        return $scope.templates;
    }]);
