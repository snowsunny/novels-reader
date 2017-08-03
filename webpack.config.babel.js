import HtmlWebpackPlugin from 'html-webpack-plugin'
import UglifyJSWebpackPlugin from 'uglifyjs-webpack-plugin'

import path from 'path'
import webpack from 'webpack'

module.exports = {
  entry: {
    'content': './src/js/content.js',
    'background': './src/js/background.js',
    'options': './src/js/options.js'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src/js'),
      'node_modules'
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'narou-reader'),
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      }
    ]
  },
  plugins: [
    // new UglifyJSWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      filename: 'html/options.html',
      template: 'src/pug/options.pug',
      inject: false
    })
  ],
  watch: true
}
