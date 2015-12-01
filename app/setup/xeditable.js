'use strict';

angular.module('MatchCalendarApp')

    // theme xeditable as bootstrap 3 style
    .run(['editableOptions', function(editableOptions){
        editableOptions.theme = 'bs3';
    }]);
