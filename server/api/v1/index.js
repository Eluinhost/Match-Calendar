const subreddits = require('./subreddits');
const init = require('./init');

function * timeSync() {
    this.body = { time: Date.now() };
}

module.exports.setup = function setup(router) {
    router.get('/sync', timeSync);
    router.get('/r/:subreddit', subreddits);
    router.get('/init.js', init);
};
