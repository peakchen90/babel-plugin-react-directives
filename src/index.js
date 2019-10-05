const { DIRECTIVES, syncOptions } = require('./shared');
const util = require('./utils/util');
const attrUtil = require('./utils/attribute');
const elementUtil = require('./utils/element');
const transformIf = require('./directives/if');
const transformShow = require('./directives/show');
const transformModel = require('./directives/model');


module.exports = ({ version }) => {
  // version is at least v6.20.0
  util.assertVersion(version, '6.20.0', 'The version of babel supported: > 6.20.0');

  const visitor = {
    JSXElement(path, state) {
      syncOptions(state.opts);

      // transform directive
      transformShow(path);
      transformModel(path);
      transformIf(path);
    },
    JSXAttribute(path) {
      const name = attrUtil(path).getName();
      let elementPath;

      switch (name) {
        case DIRECTIVES.IF:
          throw path.buildCodeFrameError(
            `There should be no more than one directive: \`${name}\`.`
          );

        case DIRECTIVES.ELSE:
        case DIRECTIVES.ELSE_IF:
          elementPath = attrUtil(path).getJSXElement();
          throw path.buildCodeFrameError(
            `\`${name}\` used on element <${elementUtil(elementPath).getName()}> without corresponding \`${DIRECTIVES.IF}\`.`
          );

        case DIRECTIVES.SHOW:
          util.codeFrameWarn(
            path,
            `There should be no more than one directive: \`${name}\``
          );
          path.remove();
          break;

        case DIRECTIVES.FOR:
          break;

        case DIRECTIVES.MODEL:
          util.codeFrameWarn(
            path,
            `There should be no more than one directive: \`${name}\``
          );
          path.remove();
          break;

        default:
      }
    }
  };

  return {
    name: 'react-directives',

    /* istanbul ignore next: reference third party */
    manipulateOptions(opts, parserOpts) {
      // https://github.com/babel/babel/blob/v7.6.2/packages/babel-plugin-syntax-jsx/src/index.js
      // If the Typescript plugin already ran, it will have decided whether
      // or not this is a TSX file.
      if (parserOpts.plugins.some((p) => (Array.isArray(p) ? p[0] : p) === 'typescript')) {
        return;
      }
      parserOpts.plugins.push('jsx');
    },

    visitor
  };
};
