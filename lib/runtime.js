function resolveValue(args) {
  return args[0] && args[0].target && typeof args[0].target === 'object'
    ? args[0].target.value
    : args[0];
};

function invokeExtraOnChange(args, items) {
  var _extraFn;

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item && typeof item === 'object' && ('onChange' in item)) {
      _extraFn = item;
    }
  }

  if (_extraFn === 'function') {
    _extraFn.apply(this, args);
  }
};

module.exports = {
  resolveValue: resolveValue,
  invokeExtraOnChange: invokeExtraOnChange
};
