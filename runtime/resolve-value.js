function resolveValue(args) {
  var target = args[0] && args[0].target;
  if(target && target.nodeType === 1) {
    return target.value;
  }
  return args[0];
}

module.exports = resolveValue;
