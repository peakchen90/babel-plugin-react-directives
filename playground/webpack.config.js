const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const __DEV__ = process.env.NODE_ENV === 'development';

module.exports = {
  mode: __DEV__ ? 'development' : 'production',
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : 'source-map',
  entry: {
    main: './src/index.js',
    playground: './src/playground.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].[hash:10].js',
    chunkFilename: 'js/[name].[chunkhash:10].js',
    publicPath: ''
  },
  externals: {
    'monaco-editor': 'monaco'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false
                  }
                ],
                '@babel/preset-react'
              ],
              plugins: []
            }
          }
        ],
        exclude: [
          path.join(__dirname, 'node_modules')
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-import')(),
                require('autoprefixer')()
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      filename: path.join(__dirname, 'dist/index.html'),
      chunks: ['main'],
      chunksSortMode: 'dependency'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'playground.html'),
      filename: path.join(__dirname, 'dist/playground.html'),
      chunks: ['playground'],
      chunksSortMode: 'dependency'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:10].css',
      chunkFilename: 'css/[name].[contenthash:10].css'
    })
  ],
  devServer: {
    hot: true,
    port: 8080,
    compress: true,
    inline: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/'
  }
};
