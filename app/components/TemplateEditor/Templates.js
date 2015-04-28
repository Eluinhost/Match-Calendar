'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.service:Templates
 * @description
 * # Templates
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('Templates', ['$rootScope', '$localForage', '$interpolate', function ($rootScope, $localForage, $interpolate) {
        var $scope = $rootScope.$new(true);

        $scope.customTemplates = [];

        $scope.customTemplateExists = function(name) {
            return !!$scope.getTemplate(name);
        };

        $scope.getTemplate = function(name) {
            for (var i = 0; i < $scope.customTemplates.length; i++) {
                if ($scope.customTemplates[i].name === name) {
                    return name;
                }
            }
        };

        $scope.compileTemplate = function(name, scope) {
            var template = $scope.getTemplate(name);

            if (!template) return '';

            return $interpolate(template.template, false, null, true)(scope);
        };

        $localForage.bind($scope, 'customTemplates');

        return $scope;
    }]);
