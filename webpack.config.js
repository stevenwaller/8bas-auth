const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const sass = require('sass')
const autoprefixer = require('autoprefixer')

module.exports = {
  // Entry
  // ----------------------------------------------------------- //
  // Tell webpack where to start and follows the graph of dependencies
  // so it knows what to bundle
  // to bundle multiple files into one:
  // entry: {
  //   myBundleName: ['./home.js', './events.js', './vendor.js']
  // }
  // multiple files with multiple outputs:
  // entry: {
  //   fileNameOne: './file.js',
  //   fileNameTwo: './anotherFile.js'
  // }
  entry: './src/index.js',

  // Output
  // ----------------------------------------------------------- //
  // where the files will be saved to
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'bundle.js',
    globalObject: 'this'
  },

  // Sourcemaps
  // ----------------------------------------------------------- //
  devtool: 'eval-source-map',

  // Loaders
  // ----------------------------------------------------------- //
  // Tell webpack what loader to use for each module based on file type
  // Webpack treats every file (.css, .html, .scss, .jpg, etc.) as a module
  // Transformations/preprocessing can be applied to the source code of a module
  // Note: loaders are applied in reverse order (last to first)
  module: {
    rules: [
      // Javascript
      // ------------------------------------------------------- //
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      // SASS, SCSS, or CSS files
      // ------------------------------------------------------- //
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            // extract styles into separate single bundled file
            loader: MiniCssExtractPlugin.loader
          },
          {
            // translate CSS into CommonJS
            // resolve url() and @imports inside CSS
            loader: 'css-loader'
          },
          {
            // process css with PostCSS plugins
            loader: 'postcss-loader',
            options: {
              // autoprefix css
              // see "browserslist" in package.json for supported browsers
              plugins: () => [autoprefixer]
            }
          },
          {
            // compile Sass to CSS
            loader: 'sass-loader',
            options: {
              // prefer dart-sass (sass) over node-sass
              implementation: sass,
              // allow absolute imports from src directory
              sassOptions: {
                includePaths: ['src']
              }
            }
          }
        ]
      }
    ]
  },

  // Resolve
  // ----------------------------------------------------------- //
  // help webpack resolve import statements
  // e.g. import React from 'react';
  resolve: {
    // define file extensions
    // so you can leave them off when importing
    extensions: ['.js']
  },

  // Plugins
  // ----------------------------------------------------------- //
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    })
  ],

  // Node
  // ----------------------------------------------------------- //
  node: {
    fs: 'empty'
  },

  // Dev Server
  // ----------------------------------------------------------- //
  devServer: {
    contentBase: './dist',
    port: 3000,
    open: true
  }
}
