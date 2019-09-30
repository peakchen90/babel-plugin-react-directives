const { default: SyntaxJSX } = require('@babel/plugin-syntax-jsx');
const {
  DIRECTIVES,
  updateOpts,
  updateTypes,
  findParentElement,
  getElementName
} = require('./shared');
const { transformIf } = require('./directives');


module.exports = ({ types: t }) => {
  return {
    name: 'react-directives',
    inherits: SyntaxJSX,
    visitor: {
      JSXAttribute(path, state) {
        const name = path.node.name.name;
        const element = findParentElement(path);
        if (!name || !element) {
          return;
        }

        updateOpts(state.opts);
        updateTypes(t);

        switch (name) {
          case DIRECTIVES.IF:
            transformIf(path, element);
            break;

          case DIRECTIVES.ELSE:
          case DIRECTIVES.ELSE_IF:
            throw path.buildCodeFrameError(
              `${name} used on element <${getElementName(element)}> without corresponding ${DIRECTIVES.IF}.`
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
