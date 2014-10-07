'use strict';

// Main application
angular.module('MatchCalendarApp', ['ui.bootstrap', 'LocalForageModule', 'ngSanitize', 'ui.router', 'ngClipboard', 'vr.directives.slider', 'ngAnimate', 'xeditable'])

    .run(function($rootScope, $localForage, DateTimeService, editableOptions) {
        editableOptions.theme = 'bs3';
        $rootScope.timeOffset = DateTimeService;
        DateTimeService.resync();

        $rootScope.appVersion = 1;

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
            key: 'schemaVersion',
            defaultValue: -1
        });

        $localForage.bind($rootScope.settings, {
            key: 'notificationTimes',
            defaultValue: [{value: 600}]
        });


        $localForage.getItem('schemaVersion').then(function(err, value){
            //delete the old cookie if we're switching schema
            if(err || value === -1) {
                var cookies = document.cookie.split(";");

                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }

                $rootScope.settings.schemaVersion = 1;
            }
        })
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
