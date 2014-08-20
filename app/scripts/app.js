'use strict';

var cookie_version = '1';

// Main application
angular.module('matchCalendarApp', ['ui.bootstrap', 'ngCookies', 'ngSanitize', 'btford.markdown', 'ui.router', 'ngClipboard', 'angular-intro', 'vr.directives.slider', 'ngAnimate'])

    .run(['$rootScope', '$cookieStore', 'DateTimeService', function($rootScope, $cookieStore, DateTimeService) {
        $rootScope.timeOffset = DateTimeService;
        DateTimeService.resync();

        $rootScope.settings = {
            time_formats: ['12h', '24h'],
            time_zones: moment.tz.names(),
            time_zone: $cookieStore.get('time_zone') || 'Etc/UTC',
            time_format: $cookieStore.get('time_format') || '24h',
            subreddits: $cookieStore.get('subreddits') || ['ultrahardcore', 'ghowden'],
            favorite_hosts: $cookieStore.get('favorite_hosts') || ['Elllzman619'],
            tour: {
                taken: $cookieStore.get('tour.taken') || false
            },
            notify_for: $cookieStore.get('notify_for') || {},
            notification_times: $cookieStore.get('notification_times') || [{value: 600}],

            //store the version of the cookie we have so we can modify the cookie data if needed in future versions
            stored_cookie_version: $cookieStore.get('cookie_version') || cookie_version
        };

        $rootScope.$watch('settings.notification_times', function (newValue) {
            $cookieStore.put('notification_times', newValue);
        }, true);

        $rootScope.$watch('settings.notify_for', function(newValue) {
            $cookieStore.put('notify_for', newValue);
        }, true);

        $rootScope.$watch('settings.tour.taken', function(newValue) {
            $cookieStore.put('tour.taken', newValue);
        });

        $rootScope.$watchCollection('settings.favorite_hosts', function(newValue) {
            $cookieStore.put('favorite_hosts', newValue);
        });

        $rootScope.$watch('settings.time_zone', function(newValue) {
            $cookieStore.put('time_zone', newValue);
        });

        $rootScope.$watch('settings.time_format', function(newValue) {
            $cookieStore.put('time_format', newValue);
        });

        $rootScope.$watchCollection('settings.subreddits', function(newValue) {
            $cookieStore.put('subreddits', newValue);
        });
    }])

    //configuration
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('list', {
                url: '/list?post',
                templateUrl: 'views/list.html'
            })

            .state('generate', {
                url: '/generate',
                templateUrl: 'views/generator.html',
                controller: 'HeadergeneratorCtrl'
            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'views/settings.html',
                controller: 'SettingsCtrl'
            });

        $urlRouterProvider.otherwise('/list');
    }])

    .directive('dateTimePicker', [function() {
        return {
            restrict: 'AE',
            scope: {
                minDate: '=?',
                pickedDate: '=',
                meridian: '=',
                timeZone: '='
            },
            templateUrl: 'views/dateTimePicker.html',
            link: function($scope, $element, $attr) {
                $scope.opened = false;

                $scope.internalJSDate = $scope.pickedDate.toDate();
                $scope.internalMinDate = $scope.minDate.toDate();

                $scope.$watch('internalJSDate', function() {
                    $scope.updatePickedDate();
                });
                $scope.$watch('timeZone', function() {
                    $scope.updatePickedDate();
                });

                $scope.updatePickedDate = function() {
                    var pickedMoment = moment($scope.internalJSDate);
                    var formattedMoment = pickedMoment.format('MMM DD HH:mm');
                    $scope.pickedDate = moment.tz(formattedMoment, 'MMM DD HH:mm', $scope.timeZone);
                };

                $scope.toggle = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = !$scope.opened;
                }
            }
        }
    }])

    //directive with keybind="expression()" key=13
    .directive('keybind', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === Number(attrs.key)) {
                    scope.$apply(function(){
                        scope.$eval(attrs.keybind);
                    });

                    event.preventDefault();
                }
            });
        };
    });
