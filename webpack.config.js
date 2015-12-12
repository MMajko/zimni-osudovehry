var webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    debug: true,
    entry: {
        main: './src/js/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: "/dist/",
        filename: '[name].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'ZOH',
        template: 'src/index.html',
        inject: 'body'
      })
    ],
    module: {
        loaders: [
          {
            test: /\.scss$/,
            loaders: ["style", "css", "sass"]
          }
      ]
    },
    devServer: {
        contentBase: "./dist",
    }
};
