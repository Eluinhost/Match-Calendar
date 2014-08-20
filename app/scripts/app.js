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



    //service for fetching reddit posts from the JSON api
    .factory( 'RedditPostsService', ['$http', '$q', '$filter', 'MatchPost', function( $http, $q, $filter, MatchPost ) {
        return {
            //fetch all
            query: function (subreddits, limit, sort) {
                //set defaults
                limit = limit || 100;
                sort = sort || 'new';

                var deferreds = [];
                angular.forEach(subreddits, function(subreddit) {
                    var deferred = $q.defer();

                    var parsed = [];
                    var unparsed = [];
                    //get the posts
                    $http.get('https://www.reddit.com/r/' + subreddit + '/search.json?q=flair%3AUpcoming_Match&restrict_sr=on&limit=' + limit + '&sort=' + sort).then(
                        function(data) {
                            angular.forEach(data.data.data.children, function(element) {
                                //parse the post
                                var matchPost = MatchPost.parseData(element.data);

                                if(null == matchPost) {
                                    return;
                                }

                                //if time was invalid push to the invalid stack
                                matchPost.starts == null ? unparsed.push(matchPost) : parsed.push(matchPost);
                            });
                            deferred.resolve({
                                parsed: parsed,
                                unparsed: unparsed
                            });
                        },
                        function() {
                            deferred.resolve({
                                parsed: parsed,
                                unparsed: unparsed
                            });
                        }
                    );
                    deferreds.push(deferred.promise);
                });

                var deferred = $q.defer();
                $q.all(deferreds).then(function(data) {
                    var parsed = [];
                    var unparsed = [];
                    angular.forEach(data, function(element) {
                        parsed.push.apply(parsed, element.parsed);
                        unparsed.push.apply(unparsed, element.unparsed);
                    });

                    //filter the parsed ones in time order
                    var filtered = $filter('orderBy')(parsed, function(element) {
                        return element.starts.format('X');
                    });

                    //add the unparsed matches to the end
                    filtered.push.apply(filtered, unparsed);
                    deferred.resolve(filtered);
                });

                return deferred.promise;
            }
        };
    }])

    .factory('HtmlNotifications', ['$q', function($q) {
        return {
            /**
             * @returns boolean true if notification available, false otherwise
             */
            supports: function() {
                return "Notification" in window;
            },
            currentPermission: function() {
                if(!Notification.permission) {
                    Notification.permission = 'default';
                }
                return Notification.permission;
            },
            /**
             * @returns {promise} resolves on granted, rejects on not
             */
            requestPermission: function() {
                var def = $q.defer();
                if(Notification.permission !== 'granted') {
                    //request the permission and update the permission value
                    Notification.requestPermission(function (status) {
                        if (Notification.permission !== status) {
                            Notification.permission = status;
                        }
                        status === 'granted' ? def.resolve() : def.reject();
                    });
                } else {
                    def.resolve();
                }
                return def.promise;
            },
            /**
             * @param title the title for the notification
             * @param options
             * @param body the body of the notification
             */
            notify: function(title, body, options) {
                this.requestPermission().then(function() {
                    options = options || [];
                    options.icon = options.icon || 'images/favicon.png';
                    options.body = body || '';

                    new Notification(title, options);
                });
            }
        };
    }])

    .factory('DateTimeService', ['$http', function($http) {
        var resyncURL = 'php/sync.php';

        return {
            synced: false,
            offset: null,
            resync: function() {
                var service = this;
                $http.get(resyncURL).then(
                    function(data) {
                        service.synced = true;
                        //this isn't really that accurate but within ping time so close enough
                        service.offset = data.data.time - moment().valueOf();
                    }
                );
            },
            currentTime: function() {
                var current = moment();
                if (this.synced) {
                    current.add('ms', this.offset);
                }
                return current;
            }
        }
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
