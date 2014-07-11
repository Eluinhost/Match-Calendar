'use strict';

// Main application
angular.module('MatchCalendar', ['ui.bootstrap', 'ngCookies', 'ngSanitize', 'btford.markdown', 'ui.router'])

    //configuration
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('list', {
                url: '/list',
                templateUrl: 'partials/list.html'
            })

            .state('generate', {
                url: '/generate',
                templateUrl: 'partials/generator.html',
                controller: 'HeaderGeneratorCtrl'
            });

        $urlRouterProvider.otherwise('/list');
    }])

    //controller for the application
    .controller('AppCtrl', ['$scope', 'RedditPostsService', '$cookieStore', '$timeout', 'HtmlNotifications', function($scope, RedditPostsService, $cookieStore, $timeout, HtmlNotifications) {
        $scope.requestPermissions = function() {
            HtmlNotifications.requestPermission().then(function() {
                HtmlNotifications.notify('Notifications Enabled!');
            });
        };
        $scope.currentPermission = function() {
            return HtmlNotifications.currentPermission();
        };

        $scope.time_formats = ['12h', '24h'];
        $scope.time_zones = moment.tz.names();

        $scope.time_zone = $cookieStore.get('time_zone');
        $scope.$watch('time_zone', function(newValue) {
            $cookieStore.put('time_zone', newValue);
        });
        if(null == $scope.time_zone) {
            $scope.time_zone = 'Etc/UTC'
        }

        $scope.time_format = $cookieStore.get('time_format');
        $scope.$watch('time_format', function(newValue) {
            $cookieStore.put('time_format', newValue);
        });
        if(null == $scope.time_format) {
            $scope.time_format = '24h';
        }

        $scope.posts = [];
        $scope.updatePosts = function() {
            RedditPostsService.query().then(function(data) {
                $scope.posts = data;
            });
        };

        (function tick() {
            $scope.current_time = moment();
            $timeout(tick, 1000);
         })();

        (function tick() {
            $scope.updatePosts();
            if(HtmlNotifications.currentPermission() === 'granted') {
                angular.forEach($scope.posts, function (post) {
                    if(post.time == null) return;

                    var timeLeft = post.time.diff($scope.current_time);
                    if(timeLeft < 1000 * 60 * 15) {
                        HtmlNotifications.notify('Game starting ' + post.time.fromNow(), post.title);
                    }
                });
            }
            $timeout(tick, 1000 * 60);
        })();
    }])

    .controller('HeaderGeneratorCtrl', ['$scope', function($scope) {

    }])

    //a match post model
    .factory('MatchPost', function () {

        function MatchPost(title, selftext, author, time, permalink, raw) {
            this.title = title;
            this.selftext = selftext;
            this.author = author;
            this.time = time;
            this.permalink = permalink;
            this.raw = raw;
        }

        /**
         * @param element the raw post element from the JSON api
         * @returns {MatchPost}
         */
        MatchPost.parseData = function (element) {
            //get the time right now
            var currentTime = moment();

            //attempt to parse the date from the post title
            var time = moment.utc(/[\w]+ [\d]+ [\d]+:[\d]+/.exec(element.title), 'MMM DD HH:mm', 'en');

            //if it's invalid (no parsable date) read as unparsed
            if(!time.isValid()) {
                time = null;
            } else if(time.diff(currentTime) < 0) {
                //if it's in the past don't show it at all
                return null;
            } else {
                //get everything after the first '- ' in the title as the actual title
                element.title = element.title.substring(element.title.indexOf('-') + 2);
            }

            var link = 'http://reddit.com/' + element.permalink;

            return new MatchPost(element.title, element.selftext, element.author, time, link, element);
        };

        //Return the constructor function
        return MatchPost;
    })

    //service for fetching reddit posts from the JSON api
    .factory( 'RedditPostsService', ['$http', '$q', '$filter', 'MatchPost', function( $http, $q, $filter, MatchPost ) {
        var uri = 'http://www.reddit.com/r/ultrahardcore/search.json?q=flair%3AUpcoming_Match&restrict_sr=on';

        return {
            //fetch all
            query: function (limit, sort) {
                var deferred = $q.defer();

                //set defaults
                limit = limit || 100;
                sort = sort || 'new';

                //get the posts
                $http.get(uri + '&limit=' + limit + '&sort=' + sort).then(
                    function(data) {

                        //filter all the posts
                        var unparsed = [];
                        var parsed = [];

                        angular.forEach(data.data.data.children, function(element) {
                            //parse the post
                            var matchPost = MatchPost.parseData(element.data);

                            if(null == matchPost) {
                                return;
                            }

                            //if time was invalid push to the invalid stack
                            matchPost.time == null ? unparsed.push(matchPost) : parsed.push(matchPost);
                        });

                        //filter the parsed ones in time order
                        var filteredParsed = $filter('orderBy')(parsed, function(element) {
                            return element.time.format('X');
                        });

                        //add the unparsed matches to the end
                        deferred.resolve(filteredParsed.concat(unparsed));
                    },
                    function(error) {
                        deferred.reject(error);
                    }
                );

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
                        console.log(status);
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

    .directive('dateTimePicker', [function() {
        return {
            restrict: 'AE',
            scope: {
                minDate: '=?',
                pickedDate: '='
            },
            templateUrl: 'partials/dateTimePicker.html',
            link: function($scope, $element, $attr) {
                $scope.opened = false;

                $scope.toggle = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.opened = !$scope.opened;
                }
            }
        }
    }]);