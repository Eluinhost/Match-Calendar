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
    .factory('MatchPost', ['MarkdownLinkDataService', '$rootScope', '$location', function (MarkdownLinkDataService, $rootScope, $location) {

        //regex to match <date> <UTC|UCT> - <match post>
        // the dash can have any spacing/dashes combo
        var matchPostRegex = /^(\w+ \d+ \d+:\d+)\s*(?:UTC|UCT)?[\s-\|]*\[?(\w*)\]?[ -]+(.*)$/i;

        var ipRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(\:\d{1,5})?/g;

        function MatchPost(id, title, selftext, author, permalink, posted) {
            this.id = id;
            this.title = title;
            this.selftext = selftext;
            this.author = author;
            this.permalink = 'http://reddit.com' + permalink;
            this.posted = posted;
            this.anchorlink = '#' + $location.path() + '?post=' + id;

            this.region = null;
            this.starts = null;
            this.opens = null;
            this.address = null;
        }

        MatchPost.prototype.setRegion = function (region) {
            this.region = region;
        };

        MatchPost.prototype.setOpens = function (opens) {
            this.opens = opens;
        };

        MatchPost.prototype.setStarts = function (starts) {
            this.starts = starts;
        };

        MatchPost.prototype.setAddress = function (address) {
            this.address = address;
        };

        /**
         * @param element the raw post element from the JSON api
         * @returns {MatchPost}
         */
        MatchPost.parseData = function (element) {
            var linkData = MarkdownLinkDataService.fetch('/matchpost', element.selftext);

            /*jshint camelcase: false */
            var post = new MatchPost(element.id, element.title, element.selftext, element.author, element.permalink, moment(element.created_utc, 'X'));

            var parsedLink = false;
            if (linkData !== null) {
                try {
                    var json = JSON.parse(linkData);

                    post.setOpens(moment(json.opens, 'YYYY-MM-DDTHH:mm:ssZ'));
                    post.setStarts(moment(json.starts, 'YYYY-MM-DDTHH:mm:ssZ'));
                    post.setRegion(json.region);
                    post.setAddress(json.address);
                    post.title = json.title;

                    parsedLink = true;
                } catch (err) {
                }
            }

            if (!parsedLink) {
                //fall back to old style title parsing
                var matches = matchPostRegex.exec(element.title);

                //post isnt formatted correctly, don't display it at all
                if (null === matches) {
                    return null;
                }

                //attempt to parse the date from the post title
                post.setStarts(moment.utc(matches[1], 'MMM DD HH:mm', 'en'));

                if (matches[2] !== '') {
                    post.region = matches[2];
                }

                post.title = matches[3];

                //basic IP checking for parsed links, this will only work for IP addresses
                var ipcheck = ipRegex.exec(element.selftext);

                if (null !== ipcheck) {
                    post.address = ipcheck[1];
                    if (typeof ipcheck[2] !== 'undefined' && ipcheck[2] !== '' && ipcheck[2] !== ':25565') {
                        post.address += ipcheck[2];
                    }
                }
            }

            var current = $rootScope.T.currentTime();

            //if it's invalid (no parsable date) read as unparsed
            if (post.starts !== null && post.starts.isValid()) {
                // if it's more than 6 months old, assume it's in the next year
                if (post.starts.diff(current, 'months') < -6) {
                    post.starts.add(1, 'years');
                }

                if (post.starts.diff(current) < 0) {
                    //if it's in the past don't show it at all
                    return null;
                }
            } else {
                post.starts = null;
            }

            if (post.opens !== null && post.opens.isValid()) {
                if (post.opens.diff(current, 'months') < -6) {
                    post.opens.add(1, 'years');
                }
            } else {
                post.opens = null;
            }

            //fix html encoded entities breaking in post titles
            post.title = he.decode(post.title, {
                'isAttributeValue': true
            });

            return post;
        };

        //Return the constructor function
        return MatchPost;
    }]);
