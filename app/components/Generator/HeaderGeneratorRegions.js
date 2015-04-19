'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:HeaderGeneratorRegions
 * @description
 * # HeaderGeneratorRegions
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('HeaderGeneratorRegions', [function () {
        return {
            AF: 'Africa',
            AN: 'Antartica',
            AS: 'Asia',
            EU: 'Europe',
            NA: 'North America',
            OC: 'Oceania',
            SA: 'South America'
        };
    }]);
