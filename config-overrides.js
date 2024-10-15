const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    'crypto': require.resolve('crypto-browserify'),
    'stream': require.resolve('stream-browserify'),
    'http': require.resolve('stream-http'),
    'https': require.resolve('https-browserify'),
    'zlib': require.resolve('browserify-zlib'),
    'url': require.resolve('url/'),
    'vm': require.resolve('vm-browserify')
  })
);