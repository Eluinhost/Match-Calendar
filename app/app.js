'use strict';

// Main application
angular.module('MatchCalendarApp', ['ui.bootstrap', 'LocalForageModule', 'ngSanitize', 'ui.router', 'ngClipboard', 'vr.directives.slider', 'ngAnimate', 'xeditable'])

    .run(function($rootScope, $localForage, DateTimeService, editableOptions, $q, Migrations,
        //eager load some services that we want to run
        Posts, PostNotifications
        ){
        editableOptions.theme = 'bs3';
        $rootScope.T = DateTimeService;
        DateTimeService.resync();

        $rootScope.appSchemaVersion = 1;

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
        $rootScope.settings.schemaVersion = -1;
        $rootScope.settings.notificationTimes = [{value: 600}];

        $rootScope.settings.generator = {
            address: '192.168.0.1',
            postTitle: 'Game Title',
            region: 'NA'
        };

        $q.all([
            $localForage.bind($rootScope.settings, 'timeZone'),
            $localForage.bind($rootScope.settings, 'timeFormat'),
            $localForage.bind($rootScope.settings, 'subreddits'),
            $localForage.bind($rootScope.settings, 'favoriteHosts'),
            $localForage.bind($rootScope.settings, 'notificationTimes'),
            $localForage.bind($rootScope.settings, 'schemaVersion'),
            $localForage.bind($rootScope.settings, 'generator')
        ]).then(function() {
            var toRun = [];
            for(var i = $rootScope.settings.schemaVersion; i < $rootScope.appSchemaVersion; i++) {
                if( i in Migrations ) {
                    toRun.push(Migrations[i]);
                }
            }
            if(toRun.length > 0) {
                toRun.reduce(function (prev, next) {
                    return prev.then(next);
                }, $q.when()).then(function () {
                    //update the version after updating the schema
                    $rootScope.settings.schemaVersion = $rootScope.appSchemaVersion;
                });
            }
        });
    })

    //configuration
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('list', {
                url: '/list?post',
                templateUrl: 'components/PostList/list.html',
                controller: 'PostListCtrl'
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
