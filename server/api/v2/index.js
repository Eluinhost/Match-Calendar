const subreddits = require('./subreddits');
const init = require('./init');

module.exports = {
    setup: router => {
        router.get('/r/:subreddit', subreddits);
        router.get('/init.js', init);
        router.get('/sync', function * timeSync() {
            this.body = { time: Date.now() };
        })
    },
    rewrites: [{
        from: '/api/v1/sync',
        to: '/api/v2/sync'
    }]
};
