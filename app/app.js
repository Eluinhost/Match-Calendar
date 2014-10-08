'use strict';

// Main application
angular.module('MatchCalendarApp', ['ui.bootstrap', 'LocalForageModule', 'ngSanitize', 'ui.router', 'ngClipboard', 'vr.directives.slider', 'ngAnimate', 'xeditable'])

    .run(function($rootScope, $localForage, DateTimeService, editableOptions) {
        editableOptions.theme = 'bs3';
        $rootScope.timeOffset = DateTimeService;
        DateTimeService.resync();

        $rootScope.appVersion = 1;

        //set up a new scope for the global settings to use
        $rootScope.settings = $rootScope.$new(true);

        //constants
        $rootScope.settings.timeFormats = ['12h', '24h'];
        $rootScope.settings.timeZones = moment.tz.names();

        //user settings
        $rootScope.settings.timeZone = 'Etc/UTC';
        $rootScope.settings.timeFormat = '24h';
        $rootScope.settings.subreddits = ['ultrahardcore'];
        $rootScope.settings.favoriteHosts = [];
        $rootScope.settings.notifyFor = {};
        $rootScope.settings.schemaVersion = -1;
        $rootScope.settings.notificationTimes = [{value: 600}];

        $localForage.bind($rootScope.settings, 'timeZone');
        $localForage.bind($rootScope.settings, 'timeFormat');
        $localForage.bind($rootScope.settings, 'subreddits');
        $localForage.bind($rootScope.settings, 'favoriteHosts');
        $localForage.bind($rootScope.settings, 'notifyFor');
        $localForage.bind($rootScope.settings, 'notificationTimes');
        $localForage.bind($rootScope.settings, 'schemaVersion').then(function() {
            //delete the old cookie if we're switching schema
            if(err || $rootScope.settings.schemaVersion === -1) {
                var cookies = document.cookie.split(";");

                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }

                $rootScope.settings.schemaVersion = 1;
            }
        });
    })

    //configuration
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('list', {
                url: '/list?post',
                templateUrl: 'components/PostList/list.html'
            })

            .state('listhelp', {
                url: '/list/help',
                templateUrl: 'components/PostList/listhelp.html'
            })

            .state('generate', {
                url: '/generate',
                templateUrl: 'components/Generator/generator.html',
                controller: 'HeadergeneratorCtrl'
            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'components/Settings/settings.html',
                controller: 'SettingsCtrl'
            })

            .state('about', {
                url: '/about',
                templateUrl: 'components/About/about.html',
                controller: 'AboutCtrl'
            });

        $urlRouterProvider.otherwise('/list');
    }]);
