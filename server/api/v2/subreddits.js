const cache = require('../PostCache');

module.exports = function * () {
    try {
        this.body = (yield cache.getItem(this.params.subreddit)).parsed;
    } catch (error) {
        this.app.emit('error', error, this);
        this.throw(502, 'Failed to fetch posts from Reddit');
    }
};

module.exports.cache = cache;
