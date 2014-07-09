'use strict';

// Main application
angular.module('MatchCalendar', ['mm.foundation'])

    //controller for the application
    .controller('AppCtrl', ['$scope', function($scope) {

    }])

    //a match post model
    .factory('MatchPost', function (Organisation) {

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
                element.data.title = element.title.substring(element.title.indexOf('-') + 2);
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
                        var parsed = $filter('filter')(data.data.data.children, function(element) {
                            //parse the post
                            var matchPost = MatchPost.parseData(element.data);

                            //if time was invalid push to the invalid stack
                            if(matchPost.time == null) {
                                unparsed.push(matchPost);
                                return false;
                            }

                            //valid add to parsed
                            return true;
                        });

                        //filter the parsed ones in time order
                        var filteredParsed = $filter('orderBy')(parsed, function(element) {
                            return element.uhccalendar.time.format('X');
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