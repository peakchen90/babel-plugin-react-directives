/**
 * 兼容babel6的types
 * @param t
 */
function fixTypes(t) {
  const types = require('@babel/types');
  t.isJSXFragment = types.isJSXFragment;
  t.spreadElement = types.spreadElement;
  t.objectExpression = types.objectExpression;
}

module.exports = {
  fixTypes
};
