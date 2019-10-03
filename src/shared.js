const { codeFrameColumns } = require('@babel/code-frame');
const assert = require('assert');
const chalk = require('chalk');
const types = require('@babel/types');

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
    prefix: 'x',
    ...options
  };
}

/**
 * 打印附带代码位置的警告信息
 * @param path
 * @param message
 */
function codeFrameWarn(path, message) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  /* istanbul ignore next: print warn info */
  console.log(chalk.yellow(`[Warn]: ${message}`));

  /* istanbul ignore next: print warn info */
  if (path && path.hub && path.node) {
    const code = path.hub.file.code;
    console.log(codeFrameColumns(
      code,
      path.node.loc,
      {
        highlightCode: true,
        linesAbove: 2,
        linesBelow: 3
      }
    ));
  }
}

/**
 * 判断版本是否支持
 * @param currentVersion
 * @param targetVersion
 * @param message
 */
function assertVersion(currentVersion, targetVersion, message) {
  const current = currentVersion.split('.').map((item) => Number(item));
  let target = [];
  if (typeof targetVersion === 'number') {
    target = [targetVersion];
  } else if (typeof targetVersion === 'string' && /^(\d+)(\.\d+)*$/.test(targetVersion)) {
    target = targetVersion.split('.').map((item) => Number(item));
  } else {
    throw new Error('invalid version');
  }

  const lenDiff = current.length - target.length;
  if (lenDiff > 0) {
    target.push(...Array(lenDiff).fill(0));
  }

  assert(
    target.some((item, index) => {
      const curr = current[index];
      if (curr === undefined || item < curr) return true;
      if (item > curr) return true;
      return index === target.length - 1;
    }),
    message || `The version supported: > ${targetVersion}`
  );
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
  codeFrameWarn,
  syncOptions,
  assertVersion,
  DirectiveData,
};
