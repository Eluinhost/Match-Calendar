const subreddits = require('./subreddits');
const init = require('./init');

module.exports = {
    setup: router => {
        router.get('/r/:subreddit', subreddits);
        router.get('/init.js', init);
    },
    rewrites: [{
        from: '/api/v2/sync',
        to: '/api/v1/sync'
    }]
};
