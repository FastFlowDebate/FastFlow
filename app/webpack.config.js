// webpack.config.js
var webpack = require('webpack')
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin')
var path = require('path')


module.exports = {
  context: __dirname + '',
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/build'
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
  externals: [
    (function () {
      var IGNORES = [
        'electron'
      ];
      return function (context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')");
        }
        return callback();
      };
    })()
  ]
}
