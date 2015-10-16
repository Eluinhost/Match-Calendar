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
    .factory('MatchPostParser', ['DateTimeService', '$location', 'GameType', function (DateTimeService, $location, GameType) {

        var ipRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?/g;
        var sizeRegex = /To(\d*)/;
        var extrasRegex = /(\[.*?])/g;

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
                    anchorlink: '#' + $location.path() + '?post=' + element.id,
                    isStartTime: false
                };

                // replace | with a dash and set a flag for start time
                post.title = post.title.replace('|', function() {
                    post.isStartTime = true;
                    return '-';
                });

                var parts = post.title.split('-');

                // post isnt formatted correctly, don't display it at all
                if (parts.length < 3) {
                    console.log('invalid match post formatting for post', post.id, post.title);
                    return null;
                }

                // trim extra whitespaces
                parts = parts.map(function (part) {
                    return part.trim();
                });

                // definately not formatted correctly, don't show
                if (parts[0].length < 3) {
                    console.log('invalid match post formatting for post', post.id, post.title);
                    return null;
                }

                // parse the region as the last 2 characters
                post.region = parts[0].slice(-2).toUpperCase();
                // attempt to parse the date from the post title
                post.opens = moment.utc(parts[0].slice(0, -2), 'MMM DD HH:mm', 'en');
                post.title = parts[1];

                // assume vanilla if no gamemodes
                if (parts.length === 3) {
                    post.gamemodes = ['Vanilla'];

                    // cut extras out of the team type
                    parts[2] = parts[2].replace(extrasRegex, function(part) {
                        post.title += ' ' + part;
                        return '';
                    }).trim();
                } else {
                    // add gamemodes
                    post.gamemodes = parts[3].split(',').map(function(mode) { return mode.trim(); });

                    if (post.gamemodes.length > 0) {
                        // cut the extras out of the final gamemode
                        post.gamemodes[post.gamemodes.length - 1] = post.gamemodes[post.gamemodes.length - 1].replace(extrasRegex, function(part) {
                            post.title += ' ' + part;
                            return '';
                        }).trim();
                    }
                }

                // teams parsing
                var style = parts[2];

                sizeRegex.exec('');
                var sizeCheck = sizeRegex.exec(style);

                if (null !== sizeCheck) {
                    post.teamSize = sizeCheck[1];
                    style = style.replace(sizeRegex, '').trim();
                }

                var type = GameType.parseGameType(style);

                // not usable style, put original values in
                if (null === type) {
                    post.teams = parts[2];
                } else {
                    post.teams = type.name;
                }

                // basic IP checking for parsed links, this will only work for IP addresses
                // TODO check for 'address: X' type string
                // reset regex in case of exact copy of previous post
                ipRegex.exec('');
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
