'use strict';

angular.module('MatchCalendarApp')

    // modify bootstrap tooltips
    .config(['$tooltipProvider', function($tooltipProvider){
        $tooltipProvider.options({
            animation: false,
            popupDelay: 400
        });
    }]);
