// webpack.config.js
var webpack = require('webpack')
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin')
var path = require('path')

var bower_dir = __dirname + '/bower_components'
var node_dir = __dirname + '/node_modules'

module.exports = {
    context: __dirname + '',
    entry: './app.js',
    target: 'electron-renderer',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/build',
        publicPath: 'http://localhost:8080/build/'
    },
    resolve: {
        alias: {
            'jquery': node_dir + '/jquery/src/jquery.js'
        }
    },
    plugins: [
        new webpackUglifyJsPlugin({
            cacheFolder: path.resolve(__dirname, 'public/cached_uglify/'),
            debug: true,
            minimize: true,
            sourceMap: false,
            output: {
                comments: false
            },
            compressor: {
                warnings: false
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            'window.$': "jquery",
            jQuery: "jquery",
            "windows.jQuery": "jquery",
            MediumEditor: "medium-editor"
        })
    ],
    loaders: [{
            test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
            loader: "imports?this=>window"
        },
        {
            test: /materialize-css\/bin\//,
            loader: 'imports?jQuery=jquery,$=jquery,hammerjs'
        },
    ]
}
