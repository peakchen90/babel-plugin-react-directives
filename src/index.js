const assert = require('assert');
const { fixTypes } = require('./compatible');
const transformIf = require('./directives/if');
const transformShow = require('./directives/show');
const {
  DIRECTIVES,
  syncBabelAPI,
  syncOptions,
  findParentJSXElement,
  getElementName,
  getAttributeName,
} = require('./shared');


module.exports = (babel) => {
  // 最低支持babel v6.0.0
  const majorVersion = Number(babel.version.split('.')[0]);
  assert(majorVersion >= 6, 'The version of babel supported: > 6.0.0');

  let JSXSyntax;

  if (majorVersion === 6) {
    fixTypes(babel.types);
    syncBabelAPI(babel);
    JSXSyntax = require('babel-plugin-syntax-jsx');
  } else {
    syncBabelAPI(babel);
    JSXSyntax = require('@babel/plugin-syntax-jsx').default;
  }

  return {
    name: 'react-directives',
    inherits: JSXSyntax,
    visitor: {
      JSXElement(path, state) {
        syncOptions(state.opts);
        // transform directive show
        transformShow(path);
        // transform directive if
        transformIf(path);
      },
      JSXAttribute(path) {
        const name = getAttributeName(path);
        let elementPath;

        switch (name) {
          case DIRECTIVES.IF:
            throw path.buildCodeFrameError(
              `There should be no more than one directive: \`${name}\``
            );
          case DIRECTIVES.ELSE:
          case DIRECTIVES.ELSE_IF:
            elementPath = findParentJSXElement(path);
            throw path.buildCodeFrameError(
              `\`${name}\` used on element <${getElementName(elementPath)}> without corresponding \`${DIRECTIVES.IF}\`.`
            );
          case DIRECTIVES.SHOW:
            throw path.buildCodeFrameError(
              `There should be no more than one directive: \`${name}\``
            );
          case DIRECTIVES.FOR:
            break;
          case DIRECTIVES.MODEL:
            break;
          default:
        }
      }
    }
  };
};
