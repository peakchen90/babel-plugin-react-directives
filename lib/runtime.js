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

/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
function classNames() {
  var hasOwn = {}.hasOwnProperty;
  var classes = [];

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!arg) continue;

    var argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg) && arg.length) {
      var inner = classNames.apply(null, arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (argType === 'object') {
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}


module.exports = {
  resolveValue: resolveValue,
  mergeProps: mergeProps,
  invokeOnChange: invokeOnChange,
  classNames: classNames
};
