const assert = require('assert');

// plugin option
const opts = {
  prefix: 'x',
  pragmaType: 'React'
};

// 指令名
const DIRECTIVES = {
  get IF() {
    return `${opts.prefix}-if`;
  },
  get ELSE() {
    return `${opts.prefix}-else`;
  },
  get ELSE_IF() {
    return `${opts.prefix}-else-if`;
  },
  get SHOW() {
    return `${opts.prefix}-show`;
  },
  get FOR() {
    return `${opts.prefix}-for`;
  },
  get MODEL() {
    return `${opts.prefix}-model`;
  }
};

/**
 * 更新插件options
 * @param options
 */
function syncOpts(options = {}) {
  const {
    prefix,
    pragmaType
  } = options;

  assert(
    prefix === undefined || (typeof prefix === 'string' && prefix.length > 0),
    'The `prefix` option should be a non-empty string.'
  );

  assert(
    pragmaType === undefined || (typeof pragmaType === 'string' && pragmaType.length > 0),
    'The `pragmaType` option should be a non-empty string.'
  );

  Object.assign(opts, {
    prefix: prefix || 'x',
    pragmaType: pragmaType || 'React',
  });
}


module.exports = {
  DIRECTIVES,
  opts,
  syncOpts,
};
