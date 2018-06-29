
process.noDeprecation = true;

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

};
