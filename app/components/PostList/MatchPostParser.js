'use strict';

/**
 * @ngdoc service
 * @name MatchCalendarApp.MatchPost
 * @description
 * # MatchPost
 * Factory in the MatchCalendarApp.
 */
angular.module('MatchCalendarApp')
    //a match post model
    .factory('MatchPostParser', ['$rootScope', 'DateTimeService', '$location', function (MarkdownLinkDataService, DateTimeService, $location) {

        var ipRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?/g;

        return {
            /**
             * @param element the raw post element from the JSON api
             * @returns {MatchPost}
             */
            parse: function (element) {
                var post = {
                    id: element.id,
                    title: element.title,
                    selftext: element.selftext,
                    author: element.author,
                    permalink: 'https://reddit.com' + element.permalink,
                    /*jshint camelcase: false */
                    posted: moment(element.created_utc, 'X'),
                    anchorlink: '#' + $location.path() + '?post=' + element.id
                };

                var parts = post.title.split('-');

                // post isnt formatted correctly, don't display it at all
                if (parts.length !== 5) {
                    return null;
                }

                // trim extra whitespaces
                parts = parts.map(function (part) {
                    return part.trim();
                });

                // attempt to parse the date from the post title
                post.opens = moment.utc(parts[0], 'MMM DD HH:mm', 'en');
                post.region = parts[1].toUpperCase();
                post.title = parts[2];
                post.teams = parts[3];
                post.gamemodes = parts[4].split(',').map(function (gamemode) {
                    return gamemode.trim();
                });

                // basic IP checking for parsed links, this will only work for IP addresses
                // TODO check for 'address: X' type string
                var ipcheck = ipRegex.exec(element.selftext);

                if (null !== ipcheck) {
                    post.address = ipcheck[1];

                    // if it's default port, dont show the port number
                    if (typeof ipcheck[2] !== 'undefined' && ipcheck[2] !== '' && ipcheck[2] !== ':25565') {
                        post.address += ipcheck[2];
                    }
                }

                //if it's invalid (no parsable date) read as unparsed date
                if (post.opens !== null && post.opens.isValid()) {
                    var current = DateTimeService.currentTime();
                    var monthsAgo = post.opens.diff(current, 'months');

                    // if it's more than 6 months old, assume it's in the next year
                    if (monthsAgo < -6) {
                        post.opens.add(1, 'years');
                    }
                    // if it's more than 6 months in the future assume it's in the last year
                    else if (monthsAgo > 6) {
                        post.opens.subtract(1, 'years');
                    }
                } else {
                    post.opens = null;
                }

                //fix html encoded entities breaking in post titles
                post.title = he.decode(post.title, {
                    'isAttributeValue': true
                });

                return post;
            }
        };
    }]);
