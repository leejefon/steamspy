const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: [
    'regenerator-runtime/runtime.js',
    './client/src/index.jsx'
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: ['babel-loader'],
      include: path.join(__dirname, 'client/src')
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { modules: true } },
        'sass-loader'
      ],
      include: path.join(__dirname, 'client/src')
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      include: path.join(__dirname, 'node_modules') // Mainly for external libs
    }]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      inject: 'body',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
  ],
  devtool: 'source-map'
};
