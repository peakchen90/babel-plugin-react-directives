const path = require('path');

/**
 * 执行测试
 * @param versionNum
 */
function runTest(versionNum) {
  let pluginTester;
  let babel;

  if (versionNum === 6) {
    pluginTester = require('./plugin-tester');
    babel = require('./babel6/node_modules/babel-core');
  } else {
    pluginTester = require('./plugin-tester');
    babel = require('./babel7/node_modules/@babel/core');
  }

  /**
   * https://github.com/babel-utils/babel-plugin-tester
   */
  pluginTester({
    babel,
    plugin: require('../src'),
    title: `babel${versionNum}`,
    filename: __filename,
    fixtures: path.join(__dirname, './fixtures'),
    endOfLine: 'lf',
    tests: [],
    formatResult: (result) => result.replace(/\s+(\/>)/g, '$1')
  });
}

runTest(6);
runTest(7);
