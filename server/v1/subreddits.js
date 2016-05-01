'use strict';

var fetch = require('node-fetch');
var moment = require('moment');
var _ = require('lodash');

var BASE_URL = 'https://www.reddit.com/';
var FLAIRS = 'q=flair:\'Upcoming Match\' OR flair:\'Community Game\'';

var packageVersion = require('../../package.json').version;

var HEADERS = {
    headers: {
        'User-Agent': 'node:Match-Calendar:v' + packageVersion + ': (by /u/ghowden)'
    }
};

function createURL(sub, limit, sort) {
    return BASE_URL + 'r/' + sub + '/search.json?' + FLAIRS + '&restrict_sr=on&limit=' + limit + '&sort=' + sort;
}

class Cache {
    constructor(builer, timeoutMillis) {
        this.items = {};
        this.timeoutMillis = timeoutMillis;
        this.builder = builer;
    }

    getItem(key) {
        var now = moment();

        if (this.items.hasOwnProperty(key)) {
            var existing = this.items[key];

            if (now.isBefore(existing.timeout)) {
                return existing.promise;
            }
        }

        var item = this.items[key] = {
            promise: this.builder(key),
            timeout: now.add(this.timeoutMillis, 'ms')
        };

        return item.promise
            .catch(function (error) {
                console.log(error);
                return undefined;
            })
    }
}

function subredditItemsBuiler(name) {
    return fetch(createURL(name, 100, 'new'), HEADERS)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Response was not OK');
            }

            return response.json();
        });
}

const cache = new Cache(subredditItemsBuiler, 1000 * 45);

module.exports = function subreddit(req, res, next) {
    if (_.isUndefined(req.params) || _.isUndefined(req.params.subreddit) || _.isEmpty(req.params.subreddit)) {
        res.status(400);
        res.json({ error: 'Must provide a non-empty subreddit to return for' });
        next();
        return;
    }

    cache.getItem(req.params.subreddit)
        .then(function (response) {
            if (_.isUndefined(response)) {
                res.status(400);
                res.json({ error: 'Unable to fetch posts from Reddit, please try again later' });
            } else {
                res.json(response);
            }

            next();
        })
        .catch(function(error) {
            console.error(error);
            res.status(500);
            res.json({ error: 'Internal server error' });
        })
};
