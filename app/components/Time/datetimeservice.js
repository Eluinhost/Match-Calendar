'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.DateTimeService
 * @description
 * # DateTimeService
 * Factory in the MatchCalendarApp.
 */
angular.module('MatchCalendarApp')
    .factory('DateTimeService', ['$http', function ($http) {
        var resyncURL = 'api/sync';

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
            }
        };
    }]);
