const isUndefined = require('lodash/isUndefined');
const cache = require('../PostCache');

function renderSubreddits(subreddits) {
    return `APP_INITIAL_DATA=${JSON.stringify({ subreddits })};`;
}

const unknown = renderSubreddits({});

let localCache;
let localCacheRendered = unknown;

module.exports = function * initial() {
    let other;
    try {
        other = (yield cache.getItem('uhcmatches')).raw;
    } catch (error) {
        // don't do anything with the error,
        // if other has changed the render cache will change below (including undefined)
    }

    // Check if we need to render the cache item
    if (isUndefined(other)) {
        localCache = undefined;
        localCacheRendered = unknown;
    } else if (other !== localCache) {
        localCache = other;
        localCacheRendered = renderSubreddits({ uhcmatches: other });
    }

    this.body = localCacheRendered;
    this.type = 'application/javascript';
};
