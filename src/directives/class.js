const t = require('@babel/types');
const { DIRECTIVES } = require('../shared');
const attrUtil = require('../utils/attribute');
const elemUtil = require('../utils/element');
const template = require('../utils/template');
const { codeFrameWarn } = require('../utils/util');

/**
 * 转换className
 * @param path
 */
function transformClass(path) {
  const attrPath = elemUtil(path).findAttrPath(DIRECTIVES.CLASS);
  if (!attrPath) {
    return;
  }

  const bindingValue = attrUtil(attrPath).valueExpr();

  /* istanbul ignore next: print warn info */
  if (!bindingValue) {
    codeFrameWarn(
      attrPath,
      `\`${DIRECTIVES.CLASS}\` used on element <${elemUtil(path).name()}> without binding value`
    );
    attrPath.remove();
    return;
  }

  // 设置 `className` prop
  elemUtil(path).mergeProps({
    prop: 'className',

    directivePath: attrPath,

    find(attr, setValue) {
      const attrName = attrUtil(attr).name();
      const valueExpr = attrUtil(attr).valueExpr();

      if (attrName === 'className') {
        if (t.isStringLiteral(valueExpr)) {
          setValue(t.objectExpression([
            t.objectProperty(
              t.identifier('className'),
              valueExpr
            )
          ]));
        } else if (t.isJSXExpressionContainer(valueExpr)) {
          setValue(t.objectExpression([
            t.objectProperty(
              t.identifier('className'),
              valueExpr.expression
            )
          ]));
        }

        return true;
      }

      return false;
    },

    getResult(mergeItems) {
      if (mergeItems.length > 0) {
        return template.getMergeClassName({
          MERGE_ITEMS: t.arrayExpression([
            mergeItems.length > 0 && t.spreadElement(
              template.getMergeProp({
                PROP_NAME: t.stringLiteral('className'),
                MERGE_ITEMS: t.arrayExpression(mergeItems)
              }).expression
            ),
            bindingValue
          ].filter(Boolean))
        }).expression;
      }

      return template.getMergeClassName({
        MERGE_ITEMS: bindingValue
      }).expression;
    },
  });

  attrPath.remove();
}

module.exports = transformClass;
