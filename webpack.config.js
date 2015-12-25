var path = require('path');
var webpack = require('webpack');

var entry = ['./app/js/index.js'];

if (process.env.NODE_ENV === 'development') {
  entry = entry.concat([
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
  ]);
}

module.exports = {
  devtool: 'eval',
  entry: entry,
  output: {
    path: path.join(__dirname, 'demos'),
    filename: 'bundle.js',
    publicPath: '/app/js/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      exclude: /build|lib|node_modules/,
    }],
  },
};
