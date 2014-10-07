'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.NotificationTimeFormat
 * @description
 * # NotificationTimeFormat
 * Factory in the MatchCalendarApp.
 */
angular.module('MatchCalendarApp')
    .factory('NotifcationTimeFormat', [function () {
        return {
            translateSeconds: function (duration) {
                var hour = 0;
                var min = 0;
                var sec = 0;

                if (duration) {
                    if (duration >= 60) {
                        min = Math.floor(duration / 60);
                        sec = duration % 60;
                    }
                    else {
                        sec = duration;
                    }

                    if (min >= 60) {
                        hour = Math.floor(min / 60);
                        min = min - hour * 60;
                    }

                    if (hour < 10) {
                        hour = '0' + hour;
                    }
                    if (min < 10) {
                        min = '0' + min;
                    }
                    if (sec < 10) {
                        sec = '0' + sec;
                    }
                }
                return hour + ':' + min + ':' + sec;
            }
        };
    }]);
