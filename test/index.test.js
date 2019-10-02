const path = require('path');
const assert = require('assert');
const pluginTester = require('./plugin-tester');

// 各版本babel
const babelMap = {
  6: require('./babel6/node_modules/babel-core'),
  7: require('./babel7/node_modules/@babel/core')
};


/**
 * 执行测试
 * @param versionNum
 */
function runTest(versionNum) {
  assert(babelMap[versionNum], 'No corresponding version of babel');

  /**
   * https://github.com/babel-utils/babel-plugin-tester
   */
  pluginTester({
    babel: babelMap[versionNum],
    plugin: require('../src'),
    title: `babel${versionNum}`,
    filename: __filename,
    fixtures: path.join(__dirname, './fixtures'),
    formatResult: (result) => result.replace(/\s+(\/>)/g, '$1'),
    endOfLine: 'lf',
    tests: []
  });
}

runTest(6);
runTest(7);
