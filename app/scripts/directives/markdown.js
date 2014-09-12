'use strict';

/**
 * @ngdoc directive
 * @name matchCalendarApp.directive:markdown
 * @description
 * # markdown
 */
angular.module('matchCalendarApp')
    .factory('markdownConverter', function() {
        return SnuOwnd.getParser();
    })
    .directive('markdown', function (markdownConverter, $sanitize) {
        return {
            scope: {
                content: '='
            },
            restrict: 'EA',
            link: function (scope, element, attrs) {
                scope.$watch(attrs.content, function (newVal) {
                    element.html($sanitize(markdownConverter.render(scope.content)));
                });
            }
        };
    });
