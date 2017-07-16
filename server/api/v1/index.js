function * timeSync() {
    this.body = { time: Date.now() };
}

module.exports.setup = function setup(router) {
    router.get('/sync', timeSync);
};
