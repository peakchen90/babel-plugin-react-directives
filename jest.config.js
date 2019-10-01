const path = require('path');

module.exports = {
  verbose: true,
  rootDir: path.resolve(__dirname),
  collectCoverage: false,
  coverageDirectory: '<rootDir>/test/coverage',
  collectCoverageFrom: [
    'src/**/*.{js}',
    '!**/node_modules/**',
  ],
};
