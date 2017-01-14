'use strict';

const fetch = require('node-fetch');
const Promise = require('bluebird');

const PromiseCache = require('../PromiseCache');
const packageVersion = require('../../package.json').version;
const parser = new (require('../../shared/MatchPostParser'))();

const OPTIONS = {
    headers: {
        'User-Agent': `node:Match-Calendar:v${packageVersion}: (by /u/ghowden)`
    },
    redirect: 'error'
};

class InvalidResponseError extends Error {}

const fetchAllFromSubreddit = Promise.coroutine(function * fetchForSubreddit(name) {
    console.info(`Loading data from /r/${name}`);

    const baseUrl = `https://www.reddit.com/r/${name}/search.json?q=flair:\'Upcoming Match\' OR flair:\'Community Game\'&restrict_sr=on&limit=100&sort=new`;
    let url = baseUrl;

    const matches = [];
    do {
        try {
            if (matches.length !== 0) {
                url = `${baseUrl}&after=${matches[matches.length - 1].data.name}`;
            }

            console.info(`Fetching from ${url}`);

            const response = yield fetch(url, OPTIONS);

            if (!response.ok) {
                throw new Error('Response was not OK');
            }

            const json = yield response.json();
            const children = json.data.children;

            console.info(`Found ${children.length} new posts`);

            if (children.length === 0) {
                break;
            }

            Array.prototype.push.apply(matches, json.data.children);
        } catch (error) {
            throw new InvalidResponseError(error);
        }
    } while (matches.length > 0 && matches.length % 100 === 0);

    console.info(`Found ${matches.length} total`);
    console.info(`Updated data from /r/${name}`);

    return matches.map(it => parser.parse(it.data));
});

// Keep valid responses for 45 seconds and failures for 5
const cache = new PromiseCache(fetchAllFromSubreddit, 1000 * 45, 1000 * 5);

module.exports = cache;
