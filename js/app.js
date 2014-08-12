'use strict';

// Main application
angular.module('MatchCalendar', ['ui.bootstrap', 'ngCookies', 'ngSanitize', 'btford.markdown', 'ui.router', 'ngClipboard', 'angular-intro'])

    .run(['$rootScope', '$cookieStore', 'DateTimeService', function($rootScope, $cookieStore, DateTimeService) {
        $rootScope.timeOffset = DateTimeService;
        DateTimeService.resync();

        $rootScope.settings = {
            time_formats: ['12h', '24h'],
            time_zones: moment.tz.names(),
            time_zone: $cookieStore.get('time_zone'),
            time_format: $cookieStore.get('time_format'),
            subreddits: $cookieStore.get('subreddits'),
            favorite_hosts: $cookieStore.get('favorite_hosts')
        };

        $rootScope.$watchCollection('settings.favorite_hosts', function(newValue) {
            $cookieStore.put('favorite_hosts', newValue);
        });
        if(null == $rootScope.settings.favorite_hosts)
            $rootScope.settings.favorite_hosts = ['Elllzman619'];

        $rootScope.$watch('settings.time_zone', function(newValue) {
            $cookieStore.put('time_zone', newValue);
        });
        if(null == $rootScope.settings.time_zone)
            $rootScope.settings.time_zone = 'Etc/UTC';

        $rootScope.$watch('settings.time_format', function(newValue) {
            $cookieStore.put('time_format', newValue);
        });
        if(null == $rootScope.settings.time_format)
            $rootScope.settings.time_format = '24h';

        $rootScope.$watchCollection('settings.subreddits', function(newValue) {
            $cookieStore.put('subreddits', newValue);
        });
        if(null == $rootScope.settings.subreddits)
            $rootScope.settings.subreddits = ['ultrahardcore', 'ghowden'];
    }])

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
            })

            .state('settings', {
                url: '/settings',
                templateUrl: 'partials/settings.html',
                controller: 'SettingsCtrl'
            });

        $urlRouterProvider.otherwise('/list');
    }])

    //controller for the application
    .controller('AppCtrl', ['$scope', 'RedditPostsService', '$cookieStore', '$timeout', 'HtmlNotifications', function($scope, RedditPostsService, $cookieStore, $timeout, HtmlNotifications) {

        $scope.updatingPosts = false;

        $scope.requestPermissions = function() {
            HtmlNotifications.requestPermission().then(function() {
                HtmlNotifications.notify('Notifications Enabled!');
            });
        };
        $scope.currentPermission = function() {
            return HtmlNotifications.currentPermission();
        };

        $scope.toggleFavorite = function(name) {
            var index = $scope.settings.favorite_hosts.indexOf(name);
            if(index === -1) {
                $scope.settings.favorite_hosts.push(name);
            } else {
                $scope.settings.favorite_hosts.splice(index, 1);
            }
        };

        $scope.posts = [];
        $scope.updatePosts = function() {
            $scope.updatingPosts = true;
            RedditPostsService.query($scope.settings.subreddits).then(function(data) {
                $scope.posts = data;
                $scope.updatingPosts = false;
                $scope.lastUpdated = $scope.timeOffset.currentTime();
            });
        };

        $scope.$watchCollection('settings.subreddits', $scope.updatePosts);

        (function tick() {
            $scope.current_time = $scope.timeOffset.currentTime();
            $timeout(tick, 1000);
         })();

        (function tick() {
            $scope.updatePosts();
            if(HtmlNotifications.currentPermission() === 'granted') {
                angular.forEach($scope.posts, function (post) {
                    if(post.opens == null) return;

                    var timeLeft = post.opens.diff($scope.current_time);
                    if(timeLeft < 1000 * 60 * 15) {
                        HtmlNotifications.notify('Game opening ' + post.opens.from($scope.timeOffset.currentTime()), post.title);
                    }
                });
            }
            $timeout(tick, 1000 * 60);
        })();
    }])

    .controller('TourController', ['$scope', '$state', function($scope, $state) {

        $scope.showTour = function() {
            return $state.current.name === 'list';
        };

        $scope.completedEvent = function () {
            console.log("Completed Event called");
        };

        $scope.exitEvent = function () {
            console.log("Exit Event called");
        };

        $scope.changeEvent = function (targetElement) {
            console.log("Change Event called");
            console.log(targetElement);
        };

        $scope.beforeChangeEvent = function (targetElement) {
            console.log("Before Change Event called");
            console.log(targetElement);
        };

        $scope.afterChangeEvent = function (targetElement) {
            console.log("After Change Event called");
            console.log(targetElement);
        };

        $scope.introOptions = {
            steps:[
                {
                    element: '.synced-time',
                    intro: 'This is the time synced with the server',
                    position: 'bottom'
                },
                {
                    element: '.picked-timezone',
                    intro: 'The selected timezone and format to show times in',
                    position: 'bottom'
                },
                {
                    element: '.last-updated',
                    intro: 'The time the list was last updated',
                    position: 'left'
                },
                {
                    element: '.refresh-icon',
                    intro: 'Force refresh the list. The list is automatically updated every minute',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .abs-game-starts',
                    intro: 'When the game starts',
                    position: 'right'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .server-address',
                    intro: 'The server address to connect to',
                    position: 'right'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .post-title',
                    intro: 'The name of the game',
                    position: 'bottom'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .time-posted',
                    intro: 'How long ago and how far in advance the match was posted'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .post-author',
                    intro: 'The reddit name of the match host',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .fa-reddit',
                    intro: 'Click the reddit icon to add the user to your favorite hosts list',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .server-region',
                    intro: 'The region the server is hosted in',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .game-opens',
                    intro: 'How long until the game opens',
                    position: 'left'
                },
                {
                    element: '.list-page > accordion .panel:nth-child(2) .game-starts',
                    intro: 'How long until the game starts',
                    position: 'left'
                }
            ],
            showStepNumbers: false,
            exitOnOverlayClick: false,
            exitOnEsc: true,
            nextLabel: '<strong>Next</strong>',
            prevLabel: 'Previous',
            skipLabel: 'Exit',
            doneLabel: 'Done'
        };

        $scope.shouldAutoStart = function() {
            return false;
        }
    }])

    .controller('SettingsCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $scope.addSubreddit = function(name) {
            if(name === '' || name === null || name === undefined) {
                return;
            }
            if($rootScope.settings.subreddits.indexOf(name) === -1) {
                $rootScope.settings.subreddits.push(name);
            }
        };
        $scope.removeSubreddit = function(index) {
            $rootScope.settings.subreddits.splice(index, 1);
        };
    }])

    .controller('HeaderGeneratorCtrl', ['$scope', function($scope) {
        $scope.regions = {
            'AF': 'Africa',
            'AN': 'Antartica',
            'AS': 'Asia',
            'EU': 'Europe',
            'NA': 'North America',
            'OC': 'Oceania',
            'SA': 'South America'
        };

        $scope.generated = {
            opens: '',
            starts: '',
            address: '',
            title: '',
            region: ''
        };

        $scope.$watch('opens', function(newValue) {
            $scope.generated.opens = newValue.utc().format('YYYY-MM-DDTHH:mm:ssZ');
            $scope.simpleUtcOpens = newValue.utc().format('YYYY-MM-DD HH:mm UTC');
        });
        $scope.$watch('starts', function(newValue) {
            $scope.generated.starts = newValue.utc().format('YYYY-MM-DDTHH:mm:ssZ');
            $scope.simpleUtcStarts = newValue.utc().format('YYYY-MM-DD HH:mm UTC');
        });
        $scope.$watch('address', function(newValue) {
            $scope.generated.address = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
        });
        $scope.$watch('post_title', function(newValue) {
            $scope.generated.title = newValue.replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
        });
        $scope.$watch('region', function(newValue) {
            $scope.generated.region = newValue;
        });

        $scope.$watch('generated', function(newValue) {
            $scope.generatedLink = '[' + JSON.stringify(newValue) + '](/matchpost)';
        }, true);

        $scope.opens = $scope.timeOffset.currentTime();
        $scope.starts = $scope.timeOffset.currentTime();
        $scope.address = '192.168.0.1';
        $scope.post_title = 'Game Title';
        $scope.region = 'NA';
    }])

    //a match post model
    .factory('MatchPost', ['MarkdownLinkDataService', '$rootScope', function (MarkdownLinkDataService, $rootScope) {

        function MatchPost(id, title, selftext, author, permalink, posted) {
            this.id = id;
            this.title = title;
            this.selftext = selftext;
            this.author = author;
            this.permalink = permalink;
            this.posted = posted;

            this.region = null;
            this.starts = null;
            this.opens = null;
            this.address = null;
        }

        MatchPost.prototype.setRegion = function(region) {
            this.region = region;
        };

        MatchPost.prototype.setOpens = function(opens) {
            this.opens = opens;
        };

        MatchPost.prototype.setStarts = function(starts) {
            this.starts = starts;
        };

        MatchPost.prototype.setAddress = function(address) {
            this.address = address;
        };

        /**
         * @param element the raw post element from the JSON api
         * @returns {MatchPost}
         */
        MatchPost.parseData = function (element) {
            var linkData = MarkdownLinkDataService.fetch('/matchpost', element.selftext);

            var post = new MatchPost(element.id, element.title, element.selftext, element.author, 'http://reddit.com/' + element.permalink, moment(element.created_utc, 'X'));

            var parsedLink = false;
            if(linkData != null) {
                try {
                    var json = JSON.parse(linkData);

                    post.setOpens(moment(json.opens, 'YYYY-MM-DDTHH:mm:ssZ'));
                    post.setStarts(moment(json.starts, 'YYYY-MM-DDTHH:mm:ssZ'));
                    post.setRegion(json.region);
                    post.setAddress(json.address);

                    parsedLink = true;
                } catch (err) {}
            }

            if(!parsedLink) {
                //fall back to old style title parsing

                //attempt to parse the date from the post title
                post.setStarts(moment.utc(/[\w]+ [\d]+ [\d]+:[\d]+/.exec(element.title), 'MMM DD HH:mm', 'en'));

                //get everything after the first '- ' in the title as the actual title
                post.title = element.title.substring(element.title.indexOf('-') + 2);
            }

            //if it's invalid (no parsable date) read as unparsed
            if(post.starts != null) {
                if (!post.starts.isValid()) {
                    post.starts = null;
                } else if (post.starts.diff($rootScope.timeOffset.currentTime()) < 0) {
                    //if it's in the past don't show it at all
                    return null;
                }
            }

            if(post.opens != null) {
                //if it's invalid (no parsable date) read as unparsed
                if (!post.opens.isValid()) {
                    post.opens = null;
                }
            }

            return post;
        };

        //Return the constructor function
        return MatchPost;
    }])

    //service for matching markdown links to specific URL path
    .factory( 'MarkdownLinkDataService', [function() {
        return {
            /**
             * Returns the raw string for the markdown link in format [data](link)
             * @param path {string} the URL that was linked to
             * @param markdown {string} the markdown
             * @returns {string} data for the link
             */
            fetch: function(path, markdown) {
                //simple regex for [data](/link) type links
                var regex = new RegExp('\\[([^\\[\\]]+)\\]\\('+path+'\\)', 'g');
                var matches = regex.exec(markdown);
                if(matches == null) {
                    return null;
                } else {
                    return matches[1];
                }
            }
        }
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
        var resyncURL = 'sync.php';

        return {
            synced: false,
            offset: null,
            resync: function() {
                var service = this;
                console.log('syncing');
                $http.get(resyncURL).then(
                    function(data) {
                        service.synced = true;
                        console.log('synced');
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
            templateUrl: 'partials/dateTimePicker.html',
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