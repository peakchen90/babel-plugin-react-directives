const { DIRECTIVES, updateOpts } = require('./shared');
const attrUtil = require('./utils/attribute');
const elemUtil = require('./utils/element');
const { codeFrameWarn, assertVersion } = require('./utils/util');

const transformIf = require('./directives/if');
const transformShow = require('./directives/show');
const transformModel = require('./directives/model');
const transformFor = require('./directives/for');
const transformClass = require('./directives/class');


module.exports = (api) => {
  if (api.assertVersion) {
    api.assertVersion('>= 7.0.0');
  } else {
    assertVersion(api.version, '>= 7.0.0');
  }

  return {
    name: 'react-directives',

    inherits: require('@babel/plugin-syntax-jsx').default,

    visitor: {
      Program(path, state) {
        updateOpts(state.opts);
      },
      JSXElement(path) {
        transformShow(path);
        transformModel(path);
        transformClass(path);
        transformFor(path);
        transformIf(path);
      },
      JSXAttribute(path) {
        const name = attrUtil(path).name();
        let elementPath;

        switch (name) {
          case DIRECTIVES.IF:
            throw path.buildCodeFrameError(
              `There should be no more than one directive: \`${name}\`.`
            );

          case DIRECTIVES.ELSE:
          case DIRECTIVES.ELSE_IF:
            elementPath = attrUtil(path).JSXElement();
            throw path.buildCodeFrameError(
              `\`${name}\` used on element <${elemUtil(elementPath).name()}> without corresponding \`${DIRECTIVES.IF}\`.`
            );

          case DIRECTIVES.SHOW:
          case DIRECTIVES.DEPRECATED_MODEL:
          case DIRECTIVES.FOR:
          case DIRECTIVES.CLASS:
            codeFrameWarn(
              path,
              `There should be no more than one directive: \`${name}\``
            );
            path.remove();
            break;

          default:
        }
      }
    }
  };
};
