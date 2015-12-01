'use strict';

angular.module(
    'MatchCalendarApp',
    [
        // all the required dependencies for the app
        'truncate', 'ui.bootstrap', 'LocalForageModule', 'monospaced.elastic', 'ngSanitize',
        'ui.router', 'ngClipboard', 'vr.directives.slider', 'ngAnimate', 'xeditable', 'pasvaz.bindonce'
    ]
);
