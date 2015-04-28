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

        $scope.customTemplates = [];

        $scope.customTemplateExists = function(name) {
            for (var i = 0; i < $scope.customTemplates.length; i++) {
                if ($scope.customTemplates[i].name === name) {
                    return true;
                }
            }

            return false;
        };

        $localForage.bind($scope, 'customTemplates');

        return $scope;
    }]);
