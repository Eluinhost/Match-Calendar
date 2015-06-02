'use strict';

/**
 * @ngdoc directive
 * @name MatchCalendarApp.directive:checkboxButton
 * @description
 * # checkboxButton
 */
angular.module('MatchCalendarApp')
    .directive('checkboxButton', [function () {
        return {
            restrict: 'E',
            templateUrl: 'components/CheckboxButton/checkboxButton.html',
            scope: {
                enabled: '='
            },
            transclude: true
        };
    }]);
