/*jshint varstmt:false */
/*jshint esnext:false */
/*jshint esversion:5 */

var config = require('./config');

var express = require('express');
var app = express();

app.get('/api/sync', function(req, res) {
    res.json({ time: Date.now() });
});

if (!config.server.apiOnly) {
    express.static.mime.define({'text/cache-manifest': ['appcache']});

    var assets = express.static('web', {
        etag: false,
        setHeaders: function(res) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    });

    // Grab from assets first
    app.use(assets);

    // Rewrite to index if not found
    app.all('*', function(req, res, next) {
        req.url = '/index.html';
        next();
    });

    // Serve index from assets
    app.use(assets);
}

var server = app.listen(config.server.port, function() {
    console.log('Server running on http://' + server.address().address + ':' + server.address().port);
});
