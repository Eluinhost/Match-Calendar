'use strict';

/**
 * @ngdoc service
 * @name matchCalendarApp.MarkdownLinkDataService
 * @description
 * # MarkdownLinkDataService
 * Factory in the matchCalendarApp.
 */
angular.module('matchCalendarApp')
    //service for matching markdown links to specific URL path
    .factory('MarkdownLinkDataService', [function () {
        return {
            /**
             * Returns the raw string for the markdown link in format [data](link)
             * @param path {string} the URL that was linked to
             * @param markdown {string} the markdown
             * @returns {string} data for the link
             */
            fetch: function (path, markdown) {
                //simple regex for [data](/link) type links
                var regex = new RegExp('\\[([^\\[\\]]+)\\]\\(' + path + '\\)', 'g');
                var matches = regex.exec(markdown);
                if (matches == null) {
                    return null;
                } else {
                    return matches[1];
                }
            }
        }
    }]);
