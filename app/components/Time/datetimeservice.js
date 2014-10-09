'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.DateTimeService
 * @description
 * # DateTimeService
 * Factory in the MatchCalendarApp.
 */
angular.module('MatchCalendarApp')
    .factory('DateTimeService', function ($http, $rootScope) {
        var resyncURL = 'api/sync';

        //header
        //currentTime.tz(settings.timeZone).format(settings.timeFormat == &apos;24h&apos; ? &apos;HH:mm&apos; : &apos;hh:mm a&apos;)

        var formats = {
            TITLE: function() {
                return $rootScope.settings.timeFormat == '24h' ? 'HH:mm' : 'hh:mm a';
            },
            HEADER: function() {
                return $rootScope.settings.timeFormat == '24h' ? 'HH:mm:ss' : 'hh:mm:ss a';
            },
            POST_HEADER: function() {
                return $rootScope.settings.timeFormat == '24h' ? 'MMM DD - HH:mm' : 'MMM DD - hh:mm a';
            },
            GENERATOR_SIMPLE: function() {
                return 'YYYY-MM-DD HH:mm Z';
            }
        };

        return {
            synced: false,
            offset: null,
            resync: function () {
                var service = this;
                $http.get(resyncURL).then(
                    function (data) {
                        service.synced = true;
                        //this isn't really that accurate but within ping time so close enough
                        service.offset = data.data.time - moment().valueOf();
                    }
                );
            },
            currentTime: function () {
                var current = moment();
                if (this.synced) {
                    current.add('ms', this.offset);
                }
                return current;
            },
            /**
             * Format the time
             *
             * @param format the format to use, function that returns the string
             * @param time the time to format, default current time
             * @param keeptz true means keep existing timezone, false means use selected
             * @returns {*}
             */
            format: function(format, time, keeptz) {
                time = time || this.currentTime();
                if(!keeptz) {
                    time.tz($rootScope.settings.timeZone);
                }
                return time.format(format());
            },
            formats: formats
        };
    });
