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

module.exports = mergeProps;
