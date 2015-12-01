'use strict';

angular.module('MatchCalendarApp')

    // use non-default storage name
    .config(['$localForageProvider', function($localForageProvider){
        $localForageProvider.config({
            name: 'MatchCalendar'
        });
    }]);
