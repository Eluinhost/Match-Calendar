'use strict';

var cookieVersion = '1';

// Main application
angular.module('MatchCalendarApp', ['ui.bootstrap', 'ngCookies', 'ngSanitize', 'ui.router', 'ngClipboard', 'vr.directives.slider', 'ngAnimate', 'xeditable'])

    .run(function($rootScope, $cookieStore, DateTimeService, editableOptions) {
        editableOptions.theme = 'bs3';
        $rootScope.timeOffset = DateTimeService;
        DateTimeService.resync();

        $rootScope.settings = {
            timeFormats: ['12h', '24h'],
            timeZones: moment.tz.names(),
            timeZone: $cookieStore.get('timeZone') || 'Etc/UTC',
            timeFormat: $cookieStore.get('timeFormat') || '24h',
            subreddits: $cookieStore.get('subreddits') || ['ultrahardcore', 'ghowden'],
            favoriteHosts: $cookieStore.get('favoriteHosts') || [],
            tour: {
                taken: $cookieStore.get('tour.taken') || false
            },
            notifyFor: $cookieStore.get('notifyFor') || {},
            notificationTimes: $cookieStore.get('notificationTimes') || [{value: 600}],

            //store the version of the cookie we have so we can modify the cookie data if needed in future versions
            storedCookieVersion: $cookieStore.get('cookieVersion') || cookieVersion
        };

        $rootScope.$watch('settings.notificationTimes', function (newValue) {
            $cookieStore.put('notificationTimes', newValue);
        }, true);

        $rootScope.$watch('settings.notifyFor', function(newValue) {
            $cookieStore.put('notifyFor', newValue);
        }, true);

        $rootScope.$watch('settings.tour.taken', function(newValue) {
            $cookieStore.put('tour.taken', newValue);
        });

        $rootScope.$watchCollection('settings.favoriteHosts', function(newValue) {
            $cookieStore.put('favoriteHosts', newValue);
        });

        $rootScope.$watch('settings.timeZone', function(newValue) {
            $cookieStore.put('timeZone', newValue);
        });

        $rootScope.$watch('settings.timeFormat', function(newValue) {
            $cookieStore.put('timeFormat', newValue);
        });

        $rootScope.$watchCollection('settings.subreddits', function(newValue) {
            $cookieStore.put('subreddits', newValue);
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
