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

function invokeOnChange(args, items) {
  var onChange = mergeProps('onChange', items);

  if (typeof onChange === 'function') {
    onChange.apply(this, args);
  }
}


module.exports = {
  resolveValue: resolveValue,
  mergeProps: mergeProps,
  invokeOnChange: invokeOnChange
};
