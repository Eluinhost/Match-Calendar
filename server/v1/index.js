const subreddits = require('./subreddits');
const router = require('koa-router')({
    prefix: '/v1'
});

router.get('/sync', function * () {
    this.body = { time: Date.now() };
});

router.get('/r/:subreddit', subreddits);

module.exports = router;
