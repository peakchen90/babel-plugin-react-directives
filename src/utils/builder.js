const { types: t} = require('../shared');

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


module.exports = {
  buildBooleanExpression
};
