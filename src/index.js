const { fixTypes } = require('./compatible');
const {
  DIRECTIVES,
  syncBabelAPI,
  syncOptions,
  codeFrameWarn,
  assertVersion
} = require('./shared');
const attrUtil = require('./utils/attribute');
const elementUtil = require('./utils/element');
const transformIf = require('./directives/if');
const transformShow = require('./directives/show');
const transformModel = require('./directives/model');


module.exports = (babel) => {
  const majorVersion = Number(babel.version.split('.')[0]);
  let JSXSyntax;

  if (majorVersion === 6) {
    fixTypes(babel.types);
    syncBabelAPI(babel);
    JSXSyntax = require('babel-plugin-syntax-jsx');
  } else {
    syncBabelAPI(babel);
    JSXSyntax = require('@babel/plugin-syntax-jsx').default;
  }

  // 最低支持babel v6.20.0
  assertVersion('6.20.0', 'The version of babel supported: > 6.20.0');

  const visitor = {
    JSXElement(path, state) {
      syncOptions(state.opts);

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
            `There should be no more than one directive: \`${name}\``
          );
        case DIRECTIVES.ELSE:
        case DIRECTIVES.ELSE_IF:
          elementPath = attrUtil(path).getJSXElement();
          throw path.buildCodeFrameError(
            `\`${name}\` used on element <${elementUtil(elementPath).getName()}> without corresponding \`${DIRECTIVES.IF}\`.`
          );
        case DIRECTIVES.SHOW:
          codeFrameWarn(
            path,
            `There should be no more than one directive: \`${name}\``
          );
          path.remove();
          break;
        case DIRECTIVES.FOR:
          break;
        case DIRECTIVES.MODEL:
          break;
        default:
      }
    }
  };

  return {
    name: 'react-directives',
    inherits: JSXSyntax,
    visitor
  };
};
