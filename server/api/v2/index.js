const subreddits = require('./subreddits');

module.exports = {
    setup: router => {
        router.get('/r/:subreddit', subreddits);
    },
    rewrites: [{
        from: '/api/v2/sync',
        to: '/api/v1/sync'
    }]
};
