function resolveValue(args) {
  return args[0] && args[0].target && typeof args[0].target === 'object'
    ? args[0].target.value
    : args[0];
};

module.exports = {
  resolveValue: resolveValue
};
