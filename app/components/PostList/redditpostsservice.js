'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.RedditPostsService
 * @description
 * # RedditPostsService
 * Factory in the MatchCalendarApp.
 */
angular.module('MatchCalendarApp')
    .factory('RedditPostsService', ['$http', '$q', '$filter', 'MatchPost', function ($http, $q, $filter, MatchPost) {
        return {
            //fetch all
            query: function (subreddits, limit, sort) {
                //set defaults
                limit = limit || 100;
                sort = sort || 'new';

                var deferreds = [];
                angular.forEach(subreddits, function (subreddit) {
                    var deferred = $q.defer();

                    var parsed = [];
                    var unparsed = [];
                    //get the posts
                    $http.get('https://www.reddit.com/r/' + subreddit + '/search.json?q=flair%3AUpcoming_Match&restrict_sr=on&limit=' + limit + '&sort=' + sort).then(
                        function (data) {
                            angular.forEach(data.data.data.children, function (element) {
                                //parse the post
                                var matchPost = MatchPost.parseData(element.data);

                                if (null === matchPost) {
                                    return;
                                }

                                //if time was invalid push to the invalid stack
                                if (matchPost.starts === null) {
                                    unparsed.push(matchPost);
                                } else {
                                    parsed.push(matchPost);
                                }
                            });
                            deferred.resolve({
                                parsed: parsed,
                                unparsed: unparsed
                            });
                        },
                        function () {
                            deferred.resolve({
                                parsed: parsed,
                                unparsed: unparsed
                            });
                        }
                    );
                    deferreds.push(deferred.promise);
                });

                var deferred = $q.defer();
                $q.all(deferreds).then(function (data) {
                    var parsed = [];
                    var unparsed = [];
                    angular.forEach(data, function (element) {
                        parsed.push.apply(parsed, element.parsed);
                        unparsed.push.apply(unparsed, element.unparsed);
                    });

                    //filter the parsed ones in time order
                    var filtered = $filter('orderBy')(parsed, function (element) {
                        return element.starts.format('X');
                    });

                    //add the unparsed matches to the end
                    filtered.push.apply(filtered, unparsed);
                    deferred.resolve(filtered);
                });

                return deferred.promise;
            }
        };
    }]);
