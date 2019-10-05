const { default: template } = require('@babel/template');

module.exports = {
  // model 调用额外方法
  callExtraFn: template(`
    typeof EXTRA_FN === "function" && EXTRA_FN.apply(this, ARGS)
  `),

  // model 获取onChange值
  getOnChangeVal: template(`
    let VAL = ARGS[0] && ARGS[0].target && typeof ARGS[0].target === "object"
      ? ARGS[0].target.value
      : ARGS[0]
  `),

  // model合并prevState定义语句
  mergePrevState: template(`
    let VAR = [...RESOLVE_EXP]
    VAR.splice(NODE, 0, VALUE)
  `)
};
