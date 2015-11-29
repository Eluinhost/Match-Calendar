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

                var deferreds = _.map(subreddits, function(subreddit) {
                    // get the posts
                    return $http
                        .get('https://www.reddit.com/r/' + subreddit + '/search.json?q=flair:\'Upcoming Match\' OR flair:\'Community Game\'&restrict_sr=on&limit=' + limit + '&sort=' + sort)
                        .then(function (data) {
                            // parse each element and filter out null posts
                            return _(data.data.data.children)
                                .map(function(element) {
                                    return MatchPostParser.parse(element.data);
                                })
                                .filter(function(element) {
                                    return element !== null;
                                })
                                .value();
                        })
                        .catch(function() {
                            // if failed return the name of the subreddit
                            return subreddit;
                        });
                });

                // when all are completed
                return $q.all(deferreds)
                    .then(function (data) {
                        // split into separated arrays
                        var errorSubs = _.filter(data, _.isString);

                        var posts = _(data)
                            .filter(_.isArray)
                            .flatten()
                            .reduce(
                                function(acc, element) {
                                    (element.opens ? acc.parsed : acc.unparsed).push(element);
                                    return acc;
                                },
                                {
                                    parsed: [],
                                    unparsed: []
                                }
                            );

                        var halfHourAgo = DateTimeService.currentTime().subtract(30, 'minutes');

                        // sort the parsed ones in time order and filter out any older than 30 mins
                        var filtered = $filter('orderBy')(posts.parsed, function (element) {
                            return element.opens.format('X');
                        }).filter(function(post) {
                            return halfHourAgo.diff(post.opens) < 0;
                        });

                        // add the unparsed matches to the end of the results
                        filtered.push.apply(filtered, posts.unparsed);

                        return {
                            posts: filtered,
                            errors: errorSubs
                        };
                    });
            }
        };
    }]);
