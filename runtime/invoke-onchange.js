var mergeProps = require('./merge-props.js');

function invokeOnchange(args, items) {
  var onChange = mergeProps('onChange', items);

  if (typeof onChange === 'function') {
    onChange.apply(this, args);
  }
}

module.exports = invokeOnchange;
