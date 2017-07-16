module.exports = {
    setup: router => {
    },
    rewrites: [{
        from: '/api/v2/sync',
        to: '/api/v1/sync'
    }]
};
