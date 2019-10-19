const { default: template } = require('@babel/template');

module.exports = {
  // model 调用额外onChange方法
  invokeExtraOnChange: template(`
    require("babel-plugin-react-directives/lib/runtime").invokeExtraOnChange.call(this, ARGS, MERGE_ITEMS)
  `),

  // model 获取onChange值
  defineModelValue: template(`
    let VAL = require("babel-plugin-react-directives/lib/runtime").resolveValue(ARGS)
  `),

  // model合并prevState定义语句
  mergeState: template(`
    let VAR = [...RESOLVE_EXP]
    VAR.splice(NODE, 0, VALUE)
  `)
};
