const { types: t, DIRECTIVES } = require('../shared');
const util = require('../utils/util');
const attrUtil = require('../utils/attribute');
const elementUtil = require('../utils/element');


/**
 * 转换show指令
 * @param path
 */
function transformShow(path) {
  const attrPath = elementUtil(path).findAttributeByName(DIRECTIVES.SHOW);
  if (!attrPath) {
    return;
  }

  const bindingValue = attrUtil(attrPath).getValueExpression();

  /* istanbul ignore next: print warn info */
  if (!bindingValue) {
    util.codeFrameWarn(
      attrPath,
      `\`${DIRECTIVES.SHOW}\` used on element <${elementUtil(path).getName()}> without binding value`
    );
    attrPath.remove();
    return;
  }

  // merge `style` prop
  elementUtil(path).mergeAttributes({
    attrName: 'style',
    directivePath: attrPath,
    callback(attr, setValue) {
      const attrName = attrUtil(attr).getName();
      const value = attrUtil(attr).getValueExpression();

      /* istanbul ignore next: print warn info */
      if (attrName === 'style') {
        if (t.isStringLiteral(value)) {
          util.codeFrameWarn(
            attr,
            'The `style` prop expected a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}}'
          );
        } else {
          setValue(value);
        }
        return true;
      }

      /* istanbul ignore next: print warn info */
      if (/^(style)$/i.test(attrName)) {
        util.codeFrameWarn(
          attr,
          `Non-lowercase \`style\` prop will be ignored, when use \`${DIRECTIVES.SHOW}\``
        );
        return true;
      }
      return false;
    },
    getResult(mergeItems) {
      return t.objectExpression(
        mergeItems.map((item) => t.spreadElement(item)).concat(
          t.objectProperty(
            t.identifier('display'),
            t.conditionalExpression(
              bindingValue,
              t.identifier('undefined'),
              t.stringLiteral('none')
            )
          )
        )
      );
    },
  });
}

module.exports = transformShow;
