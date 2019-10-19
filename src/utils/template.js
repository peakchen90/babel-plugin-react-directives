const { default: template } = require('@babel/template');

module.exports = {
  // model 调用额外方法
  callExtraFn: template(`
    typeof EXTRA_FN === "function" && EXTRA_FN.apply(this, ARGS)
  `),

  // model 获取onChange值
  getOnChangeVal: template(`
    let VAL = require("babel-plugin-react-directives/lib/runtime").resolveValue(ARGS)
  `),

  // model合并prevState定义语句
  mergePrevState: template(`
    let VAR = [...RESOLVE_EXP]
    VAR.splice(NODE, 0, VALUE)
  `)
};
