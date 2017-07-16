const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const del = require('del');
const runSequence = require('run-sequence');
const gitRev = require('git-rev-sync');
const fs = require('fs');

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AppCachePlugin = require('appcache-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');

const configFile = require('./config.js');

// Default settings are for dev, run 'prod-build-config' to change for production
const filename = '[name].[hash]';
const APP_BASE = path.resolve(__dirname, 'src');
const SHARED_BASE = path.resolve(__dirname, 'shared');
const DIST_BASE = path.resolve(__dirname, 'web');
const WEBPACK_ENTRY = `webpack-dev-server/client?http://localhost:${configFile.devServerPort}`;

const momentjsLocales = fs
    .readdirSync(path.resolve(APP_BASE, 'services/translations'))
    .filter(file => file.endsWith('.json'))
    .map(file => `${file.slice(0, -5)}.js`)
    .join('|');

const config = {
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
        filename: `${filename}.js`,
        chunkFilename: `${filename}.js`,
        pathinfo: true
    },
    devtool: 'eval',
    module: {
        loaders: [
            {
                // Our own JS files via babel
                test: /\.js$/,
                loader: 'babel?' +
                            'presets[]=es2015,' +
                            'plugins[]=transform-es2015-modules-commonjs,' +
                            'plugins[]=transform-runtime,' +
                        'cacheDirectory!eslint',
                include: [APP_BASE, SHARED_BASE]
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
            // Libraries
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
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            },
            __UHCGG_API_URL__: JSON.stringify(configFile.api.development)
        }),
        new ExtractTextPlugin(`${filename}.css`),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: `!!ejs!${path.resolve(APP_BASE, 'index_template.html')}`,
            inject: false,
            favicon: path.resolve(APP_BASE, 'images/favicon.png')
        }),
        // Only use english locale
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, new RegExp(momentjsLocales))
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

let compiler;

gulp.task('clean', () => del([DIST_BASE]));

gulp.task('prod-build-config', () => {
    // Remove webpack entry
    config.entry.app.splice(0, 1);

    // Production flags
    config.bail = true;
    config.debug = false;
    config.output.pathinfo = false;

    // Full source map
    config.devtool = 'source-map';

    // Production plugins
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
            __UHCGG_API_URL__: JSON.stringify(configFile.api.production)
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new AppCachePlugin({
            network: ['*'],
            // Exclude manifest + map files + changelog md
            exclude: [/\.appcache$/, /\.map$/, /\.md$/],
            output: 'manifest.appcache'
        })
    );
    gutil.log('Switched to production build configuration');
});

gulp.task('webpack:init', () => {
    compiler = webpack(config);
    gutil.log('Created webpack compiler');
});

gulp.task('webpack:init-prod', done => {
    runSequence('prod-build-config', 'webpack:init', done);
});

gulp.task('webpack:prod', ['webpack:init-prod'], done => {
    compiler.run((err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack:prod', err);
        }

        gutil.log('[webpack:prod]', stats.toString({
            colors: true
        }));

        done();
    });
});

gulp.task('webpack:dev', ['webpack:init'], done => {
    new WebpackDevServer(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true
        },
        contentBase: APP_BASE,
        port: configFile.devServerPort,
        proxy: {
            '/api/*': {
                target: `http://localhost:${configFile.server.port}/`,
                secure: false
            }
        }
    }).listen(configFile.devServerPort, 'localhost', err => {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }
        done();

        gutil.log(
            '[webpack-dev-server]',
            `http://localhost:${configFile.devServerPort}/webpack-dev-server/index.html`,
            `http://localhost:${configFile.devServerPort}/index.html`
        );
    });
});

gulp.task('backend', () => {
    require('./server');
});

gulp.task('build', done => {
    runSequence('clean', 'webpack:prod', done);
});

gulp.task('dev', ['webpack:dev', 'backend']);
