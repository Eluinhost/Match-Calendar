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
            template: '<button type="button" class="btn btn-xs" ng-class="{\'btn-success\': buttonEnabled, \'btn-danger\': !buttonEnabled}" ng-click="buttonEnabled = !buttonEnabled" ng-transclude></button>',
            scope: {
                buttonEnabled: '='
            },
            transclude: true
        };
    }]);
