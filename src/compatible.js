/**
 * 兼容babel6的types
 * @param t
 */
function fixTypes(t) {
  // 判断是JSX Fragment节点
  t.isJSXFragment = function isJSXFragment(node, opts = {}) {
    return !!node
      && node.type === 'JSXFragment'
      && Object.keys(opts).every((key) => node[key] === opts[key]);
  };

  // 兼容spreadElement
  t.spreadElement = t.spreadProperty;
}

module.exports = {
  fixTypes
};
