var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    debug: true,
    entry: {
        main: './src/js/index.js',
        list: './src/js/list.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'ZOH',
        filename: 'index.html',
        template: 'src/index.html',
        inject: 'body',
        chunks: ['main']
      }),
      new HtmlWebpackPlugin({
        title: 'ZOH List',
        filename: 'list.html',
        template: 'src/list.html',
        inject: 'body',
        chunks: ['list']
      })
    ],
    module: {
        loaders: [
          {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
          },
          {
            test: /\.{png|jpg|jpeg|gif}$/,
            loader: 'file-loader'
          }
      ]
    },
    devServer: {
        contentBase: "./dist",
    }
};
