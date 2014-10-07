'use strict';

// Main application
angular.module('MatchCalendarApp', ['ui.bootstrap', 'LocalForageModule', 'ngSanitize', 'ui.router', 'ngClipboard', 'vr.directives.slider', 'ngAnimate', 'xeditable'])

    .run(function($rootScope, $localForage, DateTimeService, editableOptions) {
        editableOptions.theme = 'bs3';
        $rootScope.timeOffset = DateTimeService;
        DateTimeService.resync();

        $rootScope.settings = $rootScope.$new(true);

        $rootScope.settings.timeFormats = ['12h', '24h'];
        $rootScope.settings.timeZones = moment.tz.names();

        $localForage.bind($rootScope.settings, {
            key: 'timeZone',
            defaultValue: 'Etc/UTC'
        });

        $localForage.bind($rootScope.settings, {
            key: 'timeFormat',
            defaultValue: '24h'
        });

        $localForage.bind($rootScope.settings, {
            key: 'subreddits',
            defaultValue: ['ultrahardcore']
        });

        $localForage.bind($rootScope.settings, {
            key: 'favoriteHosts',
            defaultValue: []
        });

        $localForage.bind($rootScope.settings, {
            key: 'notifyFor',
            defaultValue: {}
        });

        $localForage.bind($rootScope.settings, {
            key: 'notificationTimes',
            defaultValue: [{value: 600}]
        });

        $localForage.bind($rootScope.settings, {
            key: 'version',
            defaultValue: 0
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
