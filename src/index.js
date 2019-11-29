const { DIRECTIVES, syncOpts } = require('./shared');
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
    api.assertVersion('>= 6.20.0');
  } else {
    assertVersion(api.version, '>= 6.20.0');
  }

  return {
    name: 'react-directives',

    /* istanbul ignore next: reference third party */
    // https://github.com/babel/babel/blob/v7.6.2/packages/babel-plugin-syntax-jsx/src/index.js
    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push('objectRestSpread');

      // If the Typescript plugin already ran, it will have decided whether
      // or not this is a TSX file.
      if (parserOpts.plugins.some((p) => (Array.isArray(p) ? p[0] : p) === 'typescript')) {
        return;
      }
      parserOpts.plugins.push('jsx');
    },

    visitor: {
      Program(path, state) {
        syncOpts(state.opts);
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
          case DIRECTIVES.MODEL:
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
