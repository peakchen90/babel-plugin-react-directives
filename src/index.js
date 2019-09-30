const { default: SyntaxJSX } = require('@babel/plugin-syntax-jsx');

const {
  DIRECTIVES,
  updateOpts,
  updateTypes,
  findParentJSXElement,
  getElementName,
  getAttributeName,
  findDirectiveAttribute
} = require('./shared');

const {
  traverseIf,
  transformIf
} = require('./directives/if');


module.exports = ({ types: t }) => {
  return {
    name: 'react-directives',
    inherits: SyntaxJSX,
    visitor: {
      JSXElement(path, state) {
        updateOpts(state.opts);
        updateTypes(t);

        // transform if
        if (findDirectiveAttribute(path, DIRECTIVES.IF)) {
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
