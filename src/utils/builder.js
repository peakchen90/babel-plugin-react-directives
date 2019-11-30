const t = require('@babel/types');
const assert = require('assert');

/**
 * 构建成员调用表达式，第一个参数为对象，其后参数为属性
 * @param args
 * @return {Expression}
 */
function buildMemberExpression(...args) {
  assert(args.length >= 2, 'at least 2 parameters are required');

  return args.reduce((prev, curr) => {
    if (!prev) {
      return curr;
    }
    return t.memberExpression(prev, curr, t.isNumericLiteral(curr));
  });
}

/**
 * 构建调用运行时方法表达式
 * @param fileName
 * @param args
 * @param contextExpr
 * @return {Expression}
 */
function buildCallRuntimeExpression(fileName, args = [], contextExpr = null) {
  assert(
    typeof fileName === 'string' && fileName,
    'fileName should be a non-empty string'
  );

  const runtimeMethodExpr = t.callExpression(
    t.identifier('require'),
    [t.stringLiteral(`babel-plugin-react-directives/runtime/${fileName}`)]
  );

  let callee = runtimeMethodExpr;
  if (contextExpr) {
    callee = t.memberExpression(
      runtimeMethodExpr,
      t.identifier('call')
    );
    args = [contextExpr, ...args];
  }

  return t.callExpression(
    callee,
    args
  );
}

module.exports = {
  buildMemberExpression,
  buildCallRuntimeExpression
};
