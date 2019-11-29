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
  getMergeProp: template(`
    require("babel-plugin-react-directives/lib/runtime").mergeProps.call(this, PROP_NAME, MERGE_ITEMS)
  `),

  // 合并className
  getMergeClassName: template(`
    require("babel-plugin-react-directives/lib/runtime").classNames(MERGE_ITEMS)
  `),
};
