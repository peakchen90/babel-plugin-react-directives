const assert = require('assert');
const Ajv = require('ajv');
const ajvErrors = require('ajv-errors');
const { deprecatedError } = require('./utils/util');

// plugin option
const opts = {
  prefix: 'x',
  pragmaType: 'React',
  strict: false
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
  get CLASS() {
    return `${opts.prefix}-class`;
  },

  /* TODO 以下即将弃用 */
  get DEPRECATED_MODEL() {
    return `${opts.prefix}-model`;
  },
  get DEPRECATED_MODEL_HOOK() {
    return `${opts.prefix}-model-hook`;
  },
};

let optionsValidate;

/**
 * 更新插件options
 * @param options
 */
function updateOpts(options = {}) {
  const {
    prefix,
    pragmaType,
    strict
  } = options;

  if (!optionsValidate) {
    const ajv = new Ajv({
      allErrors: true,
      jsonPointers: true
    });
    optionsValidate = ajvErrors(ajv).compile({
      properties: {
        prefix: {
          type: 'string',
          pattern: '^[A-Za-z$_][A-Za-z0-9$_]*$',
          errorMessage: 'The `prefix` option should be a string which javascript identifier, example: `foo`, `$abc`, `_abc123`.',
        },
        pragmaType: {
          type: 'string',
          minLength: 1,
          errorMessage: 'The `pragmaType` option should be a non-empty string.'
        },
        strict: {
          type: 'boolean',
          errorMessage: 'The `strict` option should be a boolean.'
        }
      }
    });
  }

  assert(
    optionsValidate(options),
    optionsValidate.errors
    && optionsValidate.errors[0]
    && optionsValidate.errors[0].message
  );

  Object.assign(opts, {
    prefix: prefix || 'x',
    pragmaType: pragmaType || 'React',
    strict: strict || false
  });
}


module.exports = {
  DIRECTIVES,
  opts,
  updateOpts,
};
