const t = require('@babel/types');
const { DIRECTIVES } = require('../shared');
const attrUtil = require('../utils/attribute');
const elemUtil = require('../utils/element');
const { codeFrameWarn } = require('../utils/util');

/**
 * 转换for遍历指令
 * @param path
 */
function transformFor(path) {
  const attrPath = elemUtil(path).findAttrPath(DIRECTIVES.FOR);
  if (!attrPath) {
    return;
  }

  const bindingValue = attrUtil(attrPath).valueExpr();

  /* istanbul ignore next: print warn info */
  if (!bindingValue) {
    codeFrameWarn(
      attrPath,
      `\`${DIRECTIVES.FOR}\` used on element <${elemUtil(path).name()}> without binding value`
    );
    attrPath.remove();
    return;
  }

  const valuePath = attrUtil(attrPath).valuePath();

  if (!t.isBinaryExpression(bindingValue, { operator: 'in' })) {
    throw valuePath.buildCodeFrameError(
      `The \`${DIRECTIVES.FOR}\` used on element <${elemUtil(path).name()}> with invalid binding value. `
      + `Usage example: \`<div ${DIRECTIVES.FOR}={(item, index) in list}>{item}</div>\``
    );
  }
  if (
    !t.isIdentifier(bindingValue.left)
    && (!t.isSequenceExpression(bindingValue.left)
      || !bindingValue.left.expressions.every((n) => t.isIdentifier(n))
    )) {
    throw valuePath.get('left').buildCodeFrameError(
      `The \`${DIRECTIVES.FOR}\` used on element <${elemUtil(path).name()}> with invalid binding value. `
      + `Usage example: \`<div ${DIRECTIVES.FOR}={(item, index) in list}>{item}</div>\``
    );
  }

  const traverseTarget = bindingValue.right;
  let traverseArgs;

  // 最多2个参数
  if (t.isSequenceExpression(bindingValue.left)) {
    if (bindingValue.left.expressions.length > 2) {
      codeFrameWarn(
        valuePath.get('left'),
        `The \`${DIRECTIVES.FOR}\` binding value has up to 2 parameters for traversal, and the extra parameters are ignored.`
      );
    }
    traverseArgs = bindingValue.left.expressions.slice(0, 2);
  } else {
    traverseArgs = [bindingValue.left];
  }

  let replacement = t.callExpression(
    t.memberExpression(
      traverseTarget,
      t.identifier('map')
    ),
    [
      t.arrowFunctionExpression(
        traverseArgs,
        { ...path.node }
      )
    ]
  );
  // 非顶层Element
  if (!elemUtil(path).isTopElement()) {
    replacement = t.jsxExpressionContainer(
      replacement
    );
  }

  path.replaceWith(
    replacement
  );

  attrPath.remove();
}

module.exports = transformFor;
