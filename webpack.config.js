// webpack.config.js
var webpack = require('webpack')
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin')

var path = require('path')

var bower_dir = __dirname + '/app/bower_components'
var node_dir = __dirname + '/app/node_modules'

var app = {
    context: __dirname + '/app',
    entry: {
      app: './app.js',
    },
    target: 'electron-renderer',
    output: {
        path: __dirname + '/app/build',
        filename: "[name].entry.js",
        publicPath: 'http://localhost:8080/app/build/'
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
          loader: 'style-loader!css-loader'
      },
      { test: /\.svg$/, loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=public/fonts/[name].[ext]' },
      { test: /\.woff$/, loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]' },
      { test: /\.woff2$/, loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]' },
      { test: /\.[ot]tf$/, loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]' },
      { test: /\.eot$/, loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]' },
      {
          test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
          loader: "imports?this=>window"
      }, {
          test: /materialize-css\/bin\//,
          loader: 'imports?jQuery=jquery,$=jquery,hammerjs'
      }]
    }
}

/*var main = {
    context: __dirname + '/app',
    entry: {
      main: './main.js'
    },
    target: 'node',
    output: {
        path: __dirname + '/app/build',
        filename: "[name].entry.js",
        publicPath: 'http://localhost:8080/app/build/'
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
        })
    ],
    module: {
      loaders: []
    }
}*/

module.exports = [app]
