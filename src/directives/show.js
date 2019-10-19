const t = require('@babel/types');
const { DIRECTIVES } = require('../shared');
const { codeFrameWarn } = require('../utils/util');
const attrUtil = require('../utils/attribute');
const elemUtil = require('../utils/element');


/**
 * 转换show指令
 * @param path
 */
function transformShow(path) {
  const attrPath = elemUtil(path).findAttrPath(DIRECTIVES.SHOW);
  if (!attrPath) {
    return;
  }

  const bindingValue = attrUtil(attrPath).valueExpr();

  /* istanbul ignore next: print warn info */
  if (!bindingValue) {
    codeFrameWarn(
      attrPath,
      `\`${DIRECTIVES.SHOW}\` used on element <${elemUtil(path).name()}> without binding value`
    );
    attrPath.remove();
    return;
  }

  // 设置 `style` prop
  elemUtil(path).mergeProps({
    prop: 'style',
    directivePath: attrPath,
    find(attr, setValue) {
      const attrName = attrUtil(attr).name();
      const value = attrUtil(attr).valueExpr();

      /* istanbul ignore next: print warn info */
      if (attrName === 'style') {
        if (t.isStringLiteral(value)) {
          codeFrameWarn(
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
        codeFrameWarn(
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

  attrPath.remove();
}

module.exports = transformShow;
