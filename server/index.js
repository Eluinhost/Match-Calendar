const koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const rewrite = require('koa-rewrite');
const json = require('koa-json');
const etag = require('koa-etag');
const conditional = require('koa-conditional-get');

const app = koa();
const config = require('../config');

// Serve files if required
if (!config.server.apiOnly) {
    const staticCache = require('koa-static-cache');

    // Forward base path to index.html
    app.use(rewrite('/', '/index.html'));
    app.use(staticCache(path.join(__dirname, '../web'), {
        cacheControl: 'no-cache, no-store, must-revalidate',
        buffer: true,
        gzip: false
    }));
}

app.use(conditional());
app.use(etag());

app.use(json({ pretty: false, param: 'pretty' }));
app.use(rewrite('/api/sync', '/api/v1/sync')); // Legacy, before vx syntax

// Import and use each API version
const apiRoutes = new Router({
    prefix: '/api'
});

// Generic error catcher that renders as JSON
apiRoutes.use(function * (next) {
    try {
        yield next;
    } catch (err) {
        this.status = err.status || 500;
        this.body = { error: err.message };
        this.app.emit('error', err, this);
    }
});

['./v1']
    .map(it => require(it))
    .forEach(it => apiRoutes
        .use(it.routes())
        .use(it.allowedMethods())
    );

app.use(apiRoutes.routes(), apiRoutes.allowedMethods());

app.listen(config.server.port, () => console.log(`Server running on port ${config.server.port}`));
