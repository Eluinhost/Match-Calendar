'use strict';

// Main application
angular.module('MatchCalendar', ['mm.foundation', 'ngCookies'])

    //controller for the application
    .controller('AppCtrl', ['$scope', 'RedditPostsService', '$cookieStore', function($scope, RedditPostsService, $cookieStore) {
        $scope.time_formats = [
            {ID:'12h', value: '12h'},
            {ID:'24h', value: '24h'}
        ];
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
        $scope.updatePosts();
    }])

    //a match post model
    .factory('MatchPost', function () {

        function MatchPost(title, time, raw) {
            this.title = title;
            this.time = time;
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

            //if it's in the past or invalid (no parsable date) read as unparsed
            if(!time.isValid() || time.diff(currentTime) < 0) {
                time = null;
            } else {
                //get everything after the first '- ' in the title as the actual title
                element.title = element.title.substring(element.title.indexOf('-') + 2);
            }

            return new MatchPost(element.title, time, element);
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

                            //if time was invalid push to the invalid stack
                            if(matchPost.time == null) {
                                unparsed.push(matchPost);
                            } else {
                                parsed.push(matchPost);
                            }
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
    }]);