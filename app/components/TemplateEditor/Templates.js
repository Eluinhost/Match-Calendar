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
                    return $scope.customTemplates[i];
                }
            }
        };

        $scope.compileTemplate = function(name, scope) {
            var template = $scope.getTemplate(name);

            if (!template) return '';

            return $interpolate(template.template, false, null, true)(scope);
        };

        $localForage.bind($scope, 'customTemplates');

        $localForage.bind($scope, {
            key: 'customTemplates',
            defaultValue: [{
                name: 'default',
                template: '**Game date and time:** {{ opensUTC }}  \n'
                    + '**Teams:** {{ teams }}  \n'
                    + '**Scenario:** {{ scenarios }}  \n'
                    + '**IP:** <SERVER ADDRESS HERE>  \n'
                    + '**Region:** {{ region }}  \n'
                    + '**Map size:** 2500x2500 (nether is also limited)  \n'
                    + '**Slots:** 60  \n'
                    + '**Time limit:** 1.5 hours, then meetup  \n'
                    + '**Version:** 1.7.2/1.7.4/1.7.5  \n'
                    + '**PvP/iPvP:** after 15 minutes  \n'
                    + '**Permaday:** 20 minutes before MU  \n'
                    + '**No signups - first come/first serve.**  \n\n'
                    + 'Enderpearl damage is off, golden heads are off, absorption is off, nether is on.\n\n'
                    + 'WINNER: <TBD>'
            }]
        });

        return $scope;
    }]);
