/*jshint varstmt:false */
/*jshint esnext:false */
/*jshint esversion:5 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var del = require('del');
var runSequence = require('run-sequence');
var gitRev = require('git-rev-sync');

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AppCachePlugin = require('appcache-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');

var configFile = require('./config.js');

// default settings are for dev, run 'prod-build-config' to change for production
var filename = '[name].[hash]';
var APP_BASE = path.resolve(__dirname, 'src');
var DIST_BASE = path.resolve(__dirname, 'web');
var WEBPACK_ENTRY = 'webpack-dev-server/client?http://localhost:' + configFile.devServerPort;

var config = {
    indexGlobalVars: {
        HASH: gitRev.long(),
        BRANCH: gitRev.branch(),
        VERSION: require('./package').version
    },
    entry: {
        app: [WEBPACK_ENTRY, path.resolve(APP_BASE, 'index.js')]
    },
    output: {
        path: DIST_BASE,
        publicPath: '/',
        filename: filename + '.js',
        chunkFilename:  filename + '.js',
        pathinfo: true
    },
    devtool: 'eval',
    module: {
        loaders: [
            {
                // our own JS files via babel
                test: /\.js$/,
                loader: 'babel?presets[]=es2015,plugins[]=transform-es2015-modules-commonjs,plugins[]=transform-runtime,cacheDirectory!jshint!jscs',
                include: APP_BASE
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file'
            },
            {
                test: /\.(woff|woff2|ttf|eot)(\?\S*)?$/,
                loader: 'url'
            },
            {
                test: /\.(html|md)$/,
                loader: 'raw'
            },
            {
                include: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap,indentedSyntax=false')
            },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap,indentedSyntax=true')
            },
            // libraries
            {
                test: /ngclipboard.js$/,
                loader: 'imports?Clipboard=clipboard'
            },
            {
                test: /angular-localForage.js$/,
                loader: 'imports?this=>{angular: angular}'
            },
            {
                test: /ngClip.js$/,
                loader: 'imports?ZeroClipboard'
            }
        ]
    },
    resolve: {
        alias: {
            'ng-clip': 'ng-clip/src/ngClip',
            'app': APP_BASE
        }
    },
    plugins: [
        new ExtractTextPlugin(filename + '.css'),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: '!!ejs!' + path.resolve(APP_BASE, 'index_template.html'),
            inject: false,
            favicon: path.resolve(APP_BASE, 'images/favicon.png')
        }),
        // only use english locale
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/)
    ],
    node: {
        console: false,
        global: true,
        process: true,
        Buffer: false,
        setImmediate: false
    },
    postcss: [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ],
    debug: true,
    jshint: require('./package.json').jshintConfig,
    jscs: require('./package.json').jscsConfig
};

var compiler;

gulp.task('clean', function() {
    return del([DIST_BASE]);
});

gulp.task('prod-build-config', function() {
    // remove webpack entry
    config.entry.app.splice(0, 1);

    // production flags
    config.bail = true;
    config.debug = false;
    config.output.pathinfo = false;

    // full source map
    config.devtool = 'source-map';

    // production plugins
    config.plugins.push(
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new AppCachePlugin({
            network: ['*'],
            // exclude manifest + map files + changelog md
            exclude: [/\.appcache$/, /\.map$/, /\.md$/],
            output: 'manifest.appcache'
        })
    );
    gutil.log('Switched to production build configuration');
});

gulp.task('webpack:init', function() {
    compiler = webpack(config);
    gutil.log('Created webpack compiler');
});

gulp.task('webpack:init-prod', function(done) {
    runSequence('prod-build-config', 'webpack:init', done);
});

gulp.task('webpack:prod', ['webpack:init-prod'], function(done) {
    compiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError('webpack:prod', err);

        gutil.log('[webpack:prod]', stats.toString({
            colors: true
        }));

        done();
    });
});

gulp.task('webpack:dev', ['webpack:init'], function(done) {
    new WebpackDevServer(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true
        },
        contentBase: APP_BASE,
        port: configFile.devServerPort,
        proxy: {
            '/api/*': {
                target: 'http://localhost:' + configFile.server.port + '/',
                secure: false
            }
        }
    }).listen(configFile.devServerPort, 'localhost', function(err) {
        if(err) throw new gutil.PluginError('webpack-dev-server', err);
        done();

        gutil.log('[webpack-dev-server]', 'http://localhost:' + configFile.devServerPort + '/webpack-dev-server/index.html', 'http://localhost:' + configFile.devServerPort + '/index.html');
    });
});

gulp.task('backend', function() {
    require('./server');
});

gulp.task('build', function(done) {
    runSequence('clean', 'webpack:prod', done);
});

gulp.task('dev', ['webpack:dev', 'backend']);
