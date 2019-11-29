const { default: template } = require('@babel/template');

module.exports = {
  // model 调用额外onChange方法
  invokeOnChange: template(`
    require("babel-plugin-react-directives/lib/runtime").invokeOnChange.call(this, ARGS, MERGE_ITEMS)
  `),

  // model 获取onChange值
  defineModelValue: template(`
    let VAL = require("babel-plugin-react-directives/lib/runtime").resolveValue(ARGS)
  `),

  // show 合并style prop
  mergeStyleProps: template(`
    require("babel-plugin-react-directives/lib/runtime").mergeProps.call(this, "style", MERGE_ITEMS)
  `),
};
