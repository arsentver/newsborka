const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const path = require('path')
const fs = require('fs')

function generateHtmlPlugins (templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.map(item => {
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views')

const config = {
  entry: [
    './src/js/index.js',
    './src/css/style.css',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: './assets/js/[name].js',
    chunkFilename: './assets/js/[name].js'
  },
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/templates'),
        use: ['raw-loader']
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
              minimize: false,
              url: false
            }
          },
            'postcss-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('./assets/css/style.css'),
    new CopyWebpackPlugin([
      {
        from: './src/fonts',
        to: './assets/fonts'
      },
      {
        from: './src/favicon',
        to: './assets/favicon'
      },
      {
        from: './src/img',
        to: './assets/img'
      },
      {
        from: './src/uploads',
        to: './assets/uploads'
      }
    ]),
    new SVGSpritemapPlugin({
      src: './src/img/svg/icons/*.svg',
      filename: 'assets/img/svg/sprite.svg',
      prefix: '',
      generateUse: false,
      generateTitle: true
    })
  ].concat(htmlPlugins),
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    }
  }
}
module.exports = config