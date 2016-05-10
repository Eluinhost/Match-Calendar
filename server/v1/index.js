const subreddits = require('./subreddits');
const init = require('./init');

const router = require('koa-router')({
    prefix: '/v1'
});

router.get('/sync', function * () {
    this.body = { time: Date.now() };
});

router.get('/r/:subreddit', subreddits);
router.get('/init.js', init);

module.exports = router;
