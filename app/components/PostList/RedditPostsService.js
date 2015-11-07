'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.RedditPostsService
 * @description
 * # RedditPostsService
 * Factory in the MatchCalendarApp.
 */
angular.module('MatchCalendarApp')
    .factory('RedditPostsService', ['$http', '$q', '$filter', 'MatchPostParser', 'DateTimeService', function ($http, $q, $filter, MatchPostParser, DateTimeService) {
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
                    $http.get('https://www.reddit.com/r/' + subreddit + '/search.json?q=flair:\'Upcoming Match\' OR flair:\'Community Game\'&restrict_sr=on&limit=' + limit + '&sort=' + sort).then(
                        function (data) {
                            angular.forEach(data.data.data.children, function (element) {
                                //parse the post
                                var matchPost = MatchPostParser.parse(element.data);

                                if (null === matchPost) {
                                    return;
                                }

                                // if time was invalid push to the invalid stack
                                (matchPost.opens ? parsed : unparsed).push(matchPost);
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

                    var halfHourAgo = DateTimeService.currentTime().subtract(30, 'minutes');

                    // sort the parsed ones in time order and filter out any older than 30 mins
                    var filtered = $filter('orderBy')(parsed, function (element) {
                        return element.opens.format('X');
                    }).filter(function(post) {
                        return halfHourAgo.diff(post.opens) < 0;
                    });

                    // add the unparsed matches to the end of the results
                    filtered.push.apply(filtered, unparsed);
                    deferred.resolve(filtered);
                });

                return deferred.promise;
            }
        };
    }]);
