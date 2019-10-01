const path = require('path');

module.exports = {
  verbose: true,
  rootDir: path.join(__dirname),
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'test/plugin-tester.js'
  ]
};
