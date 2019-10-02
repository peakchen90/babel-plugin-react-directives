const { types: t, DIRECTIVES, codeFrameWarn } = require('../shared');
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
    codeFrameWarn(
      attrPath,
      `\`${DIRECTIVES.SHOW}\` used on element <${elementUtil(path).getName()}> without binding value`
    );
    attrPath.remove();
    return;
  }

  elementUtil(path).mergeAttributes({
    attrName: 'style',
    directivePath: attrPath,
    callback(attr, setValue) {
      const attrName = attrUtil(attr).getName();
      const value = attrUtil(attr).getValueExpression();
      if (attrName === 'style') { /* istanbul ignore next: print warn info */
        if (t.isStringLiteral(value)) {
          codeFrameWarn(
            attr,
            'The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}}'
          );
        } else {
          setValue(value);
        }
        return true;
      }

      /* istanbul ignore next: print warn info */
      if (/^(style)$/i.test(attrName)) {
        codeFrameWarn(
          attr,
          'Non-lowercase `style` prop will be ignored'
        );
        return true;
      }
      return false;
    },
    getMergeResult(mergeItems) {
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
