// webpack.config.js
var webpack = require('webpack')
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin')

var path = require('path')

var bower_dir = __dirname + '/app/bower_components'
var node_dir = __dirname + '/app/node_modules'

module.exports = {
    context: __dirname + '/app',
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
            minimize: false,
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
    module: {
      loaders: [{
          test: /\.css$/,
          loader: 'style!css'
      },{
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "file"
      }, {
          test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
          loader: "imports?this=>window"
      }, {
          test: /materialize-css\/bin\//,
          loader: 'imports?jQuery=jquery,$=jquery,hammerjs'
      }]
    }

}
