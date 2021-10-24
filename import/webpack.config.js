const webpack = require('webpack');

module.exports = {
  target: 'node',
  mode: 'none',
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })],
};
