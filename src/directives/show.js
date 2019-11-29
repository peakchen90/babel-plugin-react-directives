const t = require('@babel/types');
const { DIRECTIVES } = require('../shared');
const { codeFrameWarn } = require('../utils/util');
const attrUtil = require('../utils/attribute');
const elemUtil = require('../utils/element');
const template = require('../utils/template');


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
      const valueExpr = attrUtil(attr).valueExpr();

      /* istanbul ignore next: print warn info */
      if (attrName === 'style') {
        if (t.isStringLiteral(valueExpr)) {
          codeFrameWarn(
            attr,
            'The `style` prop expected a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}}'
          );
        } else {
          setValue(t.objectExpression([
            t.objectProperty(
              t.identifier('style'),
              valueExpr
            )
          ]));
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
      return t.objectExpression([
        mergeItems.length > 0 && t.spreadElement(
          template.getMergeProp({
            PROP_NAME: t.stringLiteral('style'),
            MERGE_ITEMS: t.arrayExpression(mergeItems)
          }).expression
        ),
        t.objectProperty(
          t.identifier('display'),
          t.conditionalExpression(
            bindingValue,
            t.identifier('undefined'),
            t.stringLiteral('none')
          )
        )
      ].filter(Boolean));
    },
  });

  attrPath.remove();
}

module.exports = transformShow;
