const assert = require('assert');

// babel api
const babel = {
  types: {}
};
const types = babel.types;

// plugin option
let opts = {};


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
 * 同步babel api
 * @param babelAPI
 */
function syncBabelAPI(babelAPI) {
  Object.keys(babelAPI).forEach((key) => {
    if (key === 'types') {
      Object.assign(babel.types, babelAPI.types);
    } else {
      babel[key] = babelAPI[key];
    }
  });
}

/**
 * 更新插件options
 * @param _opts
 */
function syncOptions(options = {}) {
  const { prefix } = options;

  assert(
    prefix === undefined || (typeof options.prefix === 'string' && options.prefix.length > 0),
    'The `prefix` option should be a non-empty string.'
  );

  opts = {
    prefix: 'rd',
    ...options
  };
}

/**
 * 打印警告信息
 * @param message
 */
function warn(message) {
  /* istanbul ignore next */
  if (console && typeof console.warn === 'function') {
    console.warn(message);
  }
}

/**
 * 包含指令的信息
 */
class DirectiveData {
  constructor(directive, path, attrPath) {
    this.directive = directive;
    this.path = path;
    this.attrPath = attrPath;
  }
}

module.exports = {
  DIRECTIVES,
  types,
  babel,
  warn,
  syncBabelAPI,
  syncOptions,
  DirectiveData,
};
