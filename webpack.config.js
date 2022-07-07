var webpack = require('webpack');
var path = require('path');
var package = require('./package.json');

var isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';

var url;
process.argv.forEach(function(arg) {
  if (arg.startsWith('--url')) {
    url = `${arg.split('=')[1]}`;
    package.proxy = url;
  }
});

console.log("url", url)

var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './build');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env = {}) => {
  return {
    context: sourcePath,
    entry: {
      app: './main.tsx'
    },
    output: {
      publicPath: "/",
      path: outPath,
      filename: isProduction ? '[contenthash].js' : '[hash].js',
      chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].[hash].js'
    },
    target: 'web',
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      mainFields: ['module', 'browser', 'main'],
      alias: {
        app: path.resolve(__dirname, 'src/app/'),
        assets: path.resolve(__dirname, 'src/assets/'),
        styles: path.resolve(__dirname, 'src/styles/')
      }
    },
    module: {
      rules: [
        // .ts, .tsx
        {
          test: /\.tsx?$/,
          use: [
            !isProduction && {
              loader: 'babel-loader',
              options: {
                plugins: ['react-hot-loader/babel']
              }
            },
            'ts-loader'
          ].filter(Boolean)
        },
        // css
        {
          test: /\.module\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: isProduction ? '[hash:base64:5]' : '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-import')({ addDependencyTo: webpack }),
                  require('postcss-url')(),
                  require('postcss-preset-env')({
                    /* use stage 2 features (defaults) */
                    stage: 2
                  }),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({
                    disabled: isProduction
                  })
                ]
              }
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              query: {
                sourceMap: !isProduction,
                importLoaders: 1,
                localIdentName: isProduction ? '[hash:base64:5]' : '[local]__[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-import')({ addDependencyTo: webpack }),
                  require('postcss-url')(),
                  require('postcss-preset-env')({
                    /* use stage 2 features (defaults) */
                    stage: 2
                  }),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({
                    disabled: isProduction
                  })
                ]
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.less$/,
          use: [{
            loader: 'style-loader',
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
          }, {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
                modifyVars: {
                  'primary-color': '#009f3c',
                  'info-color': '#1890ff',
                  'link-color': '#009f3c',
                  'input-placeholder-color': '#97A6BA',
                  'disabled-color': '#97A6BA',
                  'border-color-base': '#CFD8E3',

                  'input-height-base': '48px',
                  'border-radius-base': '4px'
                },
                javascriptEnabled: true,
              },
            },
          }],
          // ...other rules
        },
        { test: /\.html$/, use: 'html-loader' },
        {
          test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2|svg|png)$/,
          use: 'file-loader'
        }
      ]
    },
    optimization: {
      // splitChunks: {
      //   name: true,
      //   cacheGroups: {
      //     commons: {
      //       chunks: 'initial',
      //       minChunks: 2
      //     },
      //     vendors: {
      //       test: /[\\/]node_modules[\\/]/,
      //       chunks: 'all',
      //       // filename: isProduction ? 'vendor.[contenthash].js' : 'vendor.[hash].js',
      //       filename: 'vendor.[hash].js',
      //       priority: -10,
      //       maxInitialRequests: 10
      //     }
      //   }
      // },
      runtimeChunk: true
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
        DEBUG: false
      }),
      new webpack.DefinePlugin({
        process: {
          env: {
            apiUrl: JSON.stringify(url),
            DEV_SERVER: !!env.DEV_SERVER
          }
        }
      }),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[hash].css',
        disable: !isProduction
      }),
      new HtmlWebpackPlugin({
        template: 'assets/index.html',
        minify: {
          minifyJS: true,
          minifyCSS: true,
          removeComments: true,
          useShortDoctype: true,
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true
        },
        append: {
          head: `<script src="//cdn.polyfill.io/v3/polyfill.min.js"></script>`
        },
        meta: {
          title: package.name,
          description: package.description,
          keywords: Array.isArray(package.keywords) ? package.keywords.join(',') : undefined

        }

      })
    ],
    devServer: isProduction ? undefined : {
      contentBase: sourcePath,
      hot: true,
      inline: true,
      historyApiFallback: {
        disableDotRule: true
      },
      stats: 'minimal',
      clientLogLevel: 'warning',
      proxy: {
        '/api' : {
          target: url,
          secure: false,
          changeOrigin: true
        }
      }
    },
    devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
    node: {
      fs: 'empty',
      net: 'empty'
    }
  };
}
