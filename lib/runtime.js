function resolveValue(args) {
  return args[0] && args[0].target && typeof args[0].target === 'object'
    ? args[0].target.value
    : args[0];
}

function mergeProps(prop, items) {
  var result;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item && typeof item === 'object' && (prop in item)) {
      result = item[prop];
    }
  }
  return result;
}

function invokeExtraOnChange(args, items) {
  var _extraFn = mergeProps('onChange', items);

  if (typeof _extraFn === 'function') {
    _extraFn.apply(this, args);
  }
}


module.exports = {
  resolveValue: resolveValue,
  mergeProps: mergeProps,
  invokeExtraOnChange: invokeExtraOnChange
};
