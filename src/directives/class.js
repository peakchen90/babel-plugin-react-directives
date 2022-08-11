const t = require('@babel/types');
const { DIRECTIVES } = require('../shared');
const attrUtil = require('../utils/attribute');
const elemUtil = require('../utils/element');
const builder = require('../utils/builder');
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
        setValue(t.objectExpression([
          t.objectProperty(
            t.identifier('className'),
            valueExpr
          )
        ]));

        return true;
      }

      return false;
    },

    getResult(mergeItems) {
      if (mergeItems.length > 0) {
        return builder.buildCallRuntimeExpression(
          'lib-classnames.js',
          [
            t.arrayExpression([
              mergeItems.length > 0 && builder.buildCallRuntimeExpression(
                'merge-props.js',
                [
                  t.stringLiteral('className'),
                  t.arrayExpression(mergeItems)
                ],
                t.thisExpression()
              ),
              bindingValue
            ].filter(Boolean))
          ]
        );
      }

      return builder.buildCallRuntimeExpression(
        'lib-classnames.js',
        [bindingValue]
      );
    },
  });

  attrPath.remove();
}

module.exports = transformClass;
