'use strict';

const fetch = require('node-fetch');
const PromiseCache = require('../PromiseCache');
const Promise = require('bluebird');

const packageVersion = require('../../package.json').version;

const OPTIONS = {
    headers: {
        'User-Agent': `node:Match-Calendar:v${packageVersion}: (by /u/ghowden)`
    },
    redirect: 'error'
};

function createURL(sub, limit, sort) {
    return `https://www.reddit.com/r/${sub}/search.json?q=flair:\'Upcoming Match\' OR flair:\'Community Game\'&restrict_sr=on&limit=${limit}&sort=${sort}`;
}

class InvalidResponseError extends Error {}

const fetchForSubreddit = Promise.coroutine(function * fetchForSubreddit(name) {
    let response;
    console.info(`Loading data from /r/${name}`);
    try {
        response = yield fetch(createURL(name, 100, 'new'), OPTIONS);
    } catch (error) {
        throw new InvalidResponseError(error);
    }
    console.info(`Updated data from /r/${name}`);

    if (!response.ok) {
        throw new InvalidResponseError('Response was not OK');
    }

    return response.json();
});

// Keep valid responses for 45 seconds and failures for 5
const cache = new PromiseCache(fetchForSubreddit, 1000 * 45, 1000 * 5);

module.exports = function * () {
    try {
        this.body = yield cache.getItem(this.params.subreddit);
    } catch (error) {
        this.app.emit('error', error, this);
        this.throw(502, 'Failed to fetch posts from Reddit');
    }
};

module.exports.cache = cache;
