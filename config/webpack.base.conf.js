const webpack = require('webpack');

module.exports = {
  module: {
    rules: [{
      test: /\.html$/,
      loader: 'html-loader',
      options: { minimize: true },
    },
    {
      enforce: 'pre',
      test: /\.js$/,
      exclude: [/node_modules/],
      loader: 'eslint-loader',
    },
    {
      test: /\.js?$/,
      exclude: [/node_modules/],
      loader: 'babel-loader',
    },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify('1.0.0'),
    }),
  ],

};
