/**
 * 修复babel6 types的一些问题
 * @param types
 */
function fixTypes(types) {
  types.isJSXFragment = function isJSXFragment(node, opts = {}) {
    return !!node
      && node.type === 'JSXFragment'
      && Object.keys(opts).every((key) => node[key] === opts[key]);
  };
}

module.exports = {
  fixTypes
};
