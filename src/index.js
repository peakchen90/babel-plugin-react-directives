const assert = require('assert');
const { fixTypes } = require('./fix');
const {
  DIRECTIVES,
  syncBabelAPI,
  syncOptions,
  findParentJSXElement,
  getElementName,
  getAttributeName,
  findAttribute
} = require('./shared');
const {
  traverseIf,
  transformIf
} = require('./directives/if');


module.exports = (babel) => {
  // babel最低版本是6
  const majorVersion = Number(babel.version.split('.')[0]);
  assert(majorVersion >= 6, 'The minimum supported version is babel v6.0.0');

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

        // transform if
        if (findAttribute(path, DIRECTIVES.IF)) {
          const result = traverseIf(path.parentPath, true);
          if (result.length > 0) {
            transformIf(result);
          }
        }
      },
      JSXAttribute(path) {
        const name = getAttributeName(path);
        let elementPath;

        switch (name) {
          case DIRECTIVES.ELSE:
          case DIRECTIVES.ELSE_IF:
            elementPath = findParentJSXElement(path);
            throw path.buildCodeFrameError(
              `${name} used on element <${getElementName(elementPath)}> without corresponding ${DIRECTIVES.IF}.`
            );
          case DIRECTIVES.SHOW:
            // console.log(path);
            break;
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
