'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.DateTimeService
 * @description
 * # DateTimeService
 * Factory in the MatchCalendarApp.
 */
angular.module('MatchCalendarApp')
    .factory('DateTimeService', function ($http, $rootScope, $interval) {
        var resyncURL = 'api/sync';

        $interval(function() {
            $rootScope.$broadcast('clockTick');
        }, 1000);

        var synced = false;
        var offset = 0;

        var currentTime = function() {
            var current = moment();
            if (synced) {
                current.add('ms', offset);
            }
            return current;
        };

        var formats = {
            TITLE: function() {
                return $rootScope.settings.timeFormat === '24h' ? 'HH:mm' : 'hh:mm a';
            },
            HEADER: function() {
                return $rootScope.settings.timeFormat === '24h' ? 'HH:mm:ss' : 'hh:mm:ss a';
            },
            POST_HEADER: function() {
                return $rootScope.settings.timeFormat === '24h' ? 'MMM DD - HH:mm' : 'MMM DD - hh:mm a';
            },
            REDDIT_POST: function() {
                return 'MMM DD HH:mm z';
            }
        };

        var resync = function () {
            $http.get(resyncURL).then(function (data) {
                synced = true;
                //this isn't really that accurate but within ping time so close enough
                offset = data.data.time - moment().valueOf();
            });
        };
        resync();

        return {
            isSynced: function() {
                return synced;
            },
            getOffset: function() {
                return offset;
            },
            resync: resync,
            currentTime: currentTime,
            /**
             * Format the time
             *
             * @param format the format to use, function that returns the string
             * @param time the time to format, default current time
             * @param keeptz true means keep existing timezone, false means use selected
             * @returns {*}
             */
            format: function(format, time, keeptz) {
                time = time || currentTime();
                if(!keeptz) {
                    time.tz($rootScope.settings.timeZone);
                }
                return time.format(format());
            },
            formats: formats,
            moment: moment
        };
    });
