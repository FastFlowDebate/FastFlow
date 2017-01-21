// webpack.config.js
var webpack = require('webpack')

module.exports = {
  context: __dirname + '/src',
  entry: './app.js',

  output: {
    filename: 'bundle.js',
    path: __dirname + '/build'
  },

  module: {
    loaders: [
      {  }
    ]
  }
};
