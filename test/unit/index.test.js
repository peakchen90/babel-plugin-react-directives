const path = require('path');
const assert = require('assert');
const prettier = require('prettier');
const pluginTester = require('./plugin-tester');

// 各版本babel
const babelMap = {
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
    plugin: require('../../src'),
    title: `babel${versionNum}`,
    filename: __filename,
    fixtures: path.join(__dirname, './fixtures'),
    formatResult: (result) => prettier.format(result, {
      parser: 'babel',
      endOfLine: 'lf',
      bracketSpacing: false
    }).replace(/\s+(\/>|>)/g, '$1')
  });
}

runTest(7);
