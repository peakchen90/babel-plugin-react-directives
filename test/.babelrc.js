const path = require('path');

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
    path.join(__dirname, '../src')
  ]
};
