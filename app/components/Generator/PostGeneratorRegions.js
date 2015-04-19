'use strict';

/**
 * @ngdoc function
 * @name MatchCalendarApp.controller:PostGeneratorRegions
 * @description
 * # PostGeneratorRegions
 * Service of the MatchCalendarApp
 */
angular.module('MatchCalendarApp')
    .factory('PostGeneratorRegions', [function () {
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
