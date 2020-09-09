import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtensionReloader from 'webpack-extension-reloader'
import Webpack from 'webpack'
import path from 'path'

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
    path: path.join(__dirname, 'novels-reader-crx'),
  },
  module: {
    rules: [
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
    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      filename: 'html/options.html',
      template: 'src/pug/options.pug',
      inject: false
    }),
    new ExtensionReloader({
      entries: {
        contentScript: 'content',
        background: 'background',
        extensionPage: 'options'
      }
    })
  ]
}
