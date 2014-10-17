'use strict';

/**
 * @ngdoc filter
 * @name MatchCalendarApp.filter:EncodeUricomponent
 * @description
 * # EncodeUricomponent
 * Filter in the MatchCalendar.
 */
angular.module('MatchCalendarApp')
    .filter('encodeURIComponent', function () {
        return function (input) {
            return encodeURIComponent(input);
        };
    });
