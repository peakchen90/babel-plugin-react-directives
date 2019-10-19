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
  },
  get MODEL_HOOK() {
    return `${opts.prefix}-model-hook`;
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
    prefix === undefined || (typeof prefix === 'string' && /^[A-Za-z$_][A-Za-z0-9$_]*$/.test(prefix)),
    'The `prefix` option should be a string which javascript identifier, example: `foo`, `$abc`, `_abc123`.'
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
