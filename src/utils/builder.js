const assert = require('assert');
const { types: t } = require('../shared');

/**
 * 构建一个Boolean表达式(!!expression)
 * @param expression
 * @return {expression}
 */
function buildBooleanExpression(expression) {
  return t.unaryExpression(
    '!',
    t.unaryExpression('!', expression, true),
    true
  );
}

/**
 * 构建成员调用表达式，第一个参数为对象，其后参数为属性
 * @param args
 * @return {expression}
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

module.exports = {
  buildBooleanExpression,
  buildMemberExpression
};
