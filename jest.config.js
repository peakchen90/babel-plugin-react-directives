const path = require('path');

module.exports = {
  verbose: true,
  rootDir: path.join(__dirname),
  transform: {
    '\\.js$': 'babel-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'test'
  ],
  moduleNameMapper: {
    '^babel-plugin-react-directives/(.*)$': '<rootDir>/$1'
  },
};
