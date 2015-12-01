'use strict';

angular.module('MatchCalendarApp')

    // modify bootstrap tooltips
    .run(['$tooltipProvider', function($tooltipProvider){
        $tooltipProvider.options({
            animation: false,
            popupDelay: 400
        });
    }]);
