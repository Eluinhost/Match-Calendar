/*jshint varstmt:false */
/*jshint esnext:false */
/*jshint esversion:5 */

var config = require('../config');

var express = require('express');
var app = express();

var v1 = require('./v1');

// Sync API
app.get('/api/sync', v1.timeSync); // legacy
app.get('/api/v1/sync', v1.timeSync);

// Subreddit API
app.get('/api/v1/r/:subreddit', v1.subreddits);

// Serve files if required
if (!config.server.apiOnly) {
    express.static.mime.define({'text/cache-manifest': ['appcache']});

    app.use(express.static('web', {
        etag: false,
        setHeaders: function(res) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }));
}

var server = app.listen(config.server.port, function() {
    console.log('Server running on http://' + server.address().address + ':' + server.address().port);
});
