import ExtensionReloader from 'webpack-extension-reloader'
import { VueLoaderPlugin } from 'vue-loader'
import PugPlugin from 'pug-plugin'
import Webpack from 'webpack'
import path from 'path'

module.exports = {
  entry: {
    'content': './src/js/content.js',
    'background': './src/js/background.js',
    'options': './src/js/options.js',
    'html/options': './src/pug/options.pug'
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
        oneOf: [
          {
            resourceQuery: /^\?vue/u,
            loader: PugPlugin.loader,
            options: {
              method: 'html',
            },
          },
          {
            loader: PugPlugin.loader,
            options: {
              method: 'compile',
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.sass$/,
        use: [
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    new Webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new ExtensionReloader({
      entries: {
        contentScript: 'content',
        background: 'background',
        extensionPage: ['options', 'html/options']
      }
    }),
    new VueLoaderPlugin(),
    new PugPlugin({
      pretty: true,
      extractCss: {
        filename: 'css/[name].css'
      }
    })
  ]
}
