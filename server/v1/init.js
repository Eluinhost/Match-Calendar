const cache = require('./subreddits').cache;

module.exports = function * initial() {
    const data = {
        subreddits: {
            uhcmatches: yield cache.getItem('uhcmatches')
        }
    };

    this.body = `APP_INITIAL_DATA = ${JSON.stringify(data)}`;
    this.type = 'application/javascript';
};
