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
            templateUrl: 'components/checkboxButton/checkboxButton.html',
            scope: {
                buttonEnabled: '='
            },
            transclude: true
        };
    }]);
