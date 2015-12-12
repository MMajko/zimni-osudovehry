var webpack = require('webpack'),
    path = require('path');

module.exports = {
    debug: true,
    entry: {
        main: 'src/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
          {
            test: /\.scss$/,
            loader: "css-loader!sass-loader"
          },
          {
            test: /\.css$/,
            loader: "css-loader!autoprefixer-loader"
          }
      ]
    }
};
