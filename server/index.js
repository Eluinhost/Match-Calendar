const koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const rewrite = require('koa-rewrite');
const json = require('koa-json');
const fs = require('fs');
const { flatMap, forEach, filter, map } = require('lodash');
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

const apiFolder = path.join(__dirname, 'api');

const apiRoutes = map(
    filter(
        fs.readdirSync(apiFolder),
        name => fs.statSync(path.join(apiFolder, name)).isDirectory()
    ),
    name => {
        const imported = require(`./api/${name}`);

        return {
            name,
            setup: imported.setup,
            rewrites: imported.rewrites || []
        };
    }
);

// Run rewrites before adding routes
forEach(
    flatMap(
        apiRoutes,
        it => it.rewrites
    ),
    it => {
        console.log(`Rewriting '${it.from}' to '${it.to}'`);
        app.use(rewrite(it.from, it.to))
    }
);

// Base API route
const apiRouter = new Router({
    prefix: '/api'
});

// Generic error catcher that renders as JSON
apiRouter.use(function * (next) {
    try {
        yield next;
    } catch (err) {
        this.status = err.status || 500;
        this.body = { error: err.message };
        this.app.emit('error', err, this);
    }
});

// Run the setup function for each version
forEach(
    apiRoutes,
    ({ name, setup }) => {
        // Create route for /v1 e.t.c.
        const router = new Router({ prefix: `/${name}` });
        setup(router);
        console.log(`Created API '${name}'`);
        router.stack.forEach(it => {
            console.log(`  ${it.methods.map(it => `[${it}]`)} - ${apiRouter.opts.prefix}${it.path}`);
        });

        // Attach to parent API route
        apiRouter.use(router.routes()).use(router.allowedMethods());
    }
);

app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

app.listen(config.server.port, () => console.log(`Server running on port ${config.server.port}`));
