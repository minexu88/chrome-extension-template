'use strict';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  getCompileJSConfig: (outputFilename = 'index.js', extraWebpackConfig = {}) => {
    return {
      module: {
        rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-0']
            }
          }
        }]
      },
      ...process.env.NODE_ENV === 'dev' ? require('./webpack.dev') : require('./webpack.prod'),
      output: {
        filename: outputFilename
      },
      ...extraWebpackConfig
    };
  },
  getCompileReactConfig: (outputFileName = 'index', htmlPath, extraWebpackConfig = {}) => {
    return {
      module: {
        rules: [{
          test: /\.(js|mjs|jsx)$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['react', 'es2015', 'stage-0']
          }
        }, {
          test: /\.(scss|sass)$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: { importLoaders: 2 }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009'
                    },
                    stage: 3
                  })
                ]
              }
            },
            require.resolve('sass-loader')
          ]
        }]
      },
      plugins: [
        new HtmlWebpackPlugin({
          inject: true,
          template: htmlPath
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, {}),
        new MiniCssExtractPlugin({
          filename: `${outputFileName}.css`
        })
      ],
      ...process.env.NODE_ENV === 'dev' ? require('./webpack.dev') : require('./webpack.prod'),
      output: {
        filename: `${outputFileName}.js`
      },
      ...extraWebpackConfig
    };
  }
};
