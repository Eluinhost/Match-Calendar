'use strict';

/**
 * @ngdoc directive
 * @name matchCalendarApp.directive:keybind
 * @description
 * # keybind
 */
angular.module('matchCalendarApp')
    //directive with keybind="expression()" key=13
    .directive('keybind', function () {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if (event.which === Number(attrs.key)) {
                    scope.$apply(function () {
                        scope.$eval(attrs.keybind);
                    });

                    event.preventDefault();
                }
            });
        };
    });
