const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
    publicPath: __DEV__ ? '' : '/babel-plugin-react-directives/'
  },
  externals: {
    'monaco-editor': 'monaco',
    monaco: 'monaco'
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
                  { modules: false }
                ]
              ]
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'),
      filename: path.join(__dirname, 'dist/index.html'),
      chunks: ['runtime', 'vendor', 'main'],
      minify: __DEV__ ? false : {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
      },
      chunksSortMode: 'dependency',
      favicon: path.join(__dirname, 'public/favicon.ico')
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/playground.html'),
      filename: path.join(__dirname, 'dist/playground.html'),
      chunks: ['runtime', 'vendor', 'playground'],
      minify: __DEV__ ? false : {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
      },
      chunksSortMode: 'dependency',
      favicon: path.join(__dirname, 'public/favicon.ico')
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
  },
  optimization: {
    minimize: !__DEV__,
    // 压缩配置
    minimizer: [
      new TerserPlugin(),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true
          }
        }
      })
    ],
    splitChunks: {
      name: true,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]|[\\/]lib[\\/]/,
          priority: -10,
          chunks: 'all',
          enforce: true
        }
      }
    },
    // runtime
    runtimeChunk: 'single'
  }
};
