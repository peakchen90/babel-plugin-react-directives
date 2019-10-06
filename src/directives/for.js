const { types: t, DIRECTIVES } = require('../shared');
const util = require('../utils/util');
const attrUtil = require('../utils/attribute');
const elementUtil = require('../utils/element');

/**
 * 转换for遍历指令
 * @param path
 */
function transformFor(path) {
  const attrPath = elementUtil(path).findAttributeByName(DIRECTIVES.FOR);
  if (!attrPath) {
    return;
  }

  const bindingValue = attrUtil(attrPath).getValueExpression();

  /* istanbul ignore next: print warn info */
  if (!bindingValue) {
    util.codeFrameWarn(
      attrPath,
      `\`${DIRECTIVES.FOR}\` used on element <${elementUtil(path).getName()}> without binding value`
    );
    attrPath.remove();
    return;
  }

  const valuePath = attrUtil(attrPath).getValuePath();

  if (!t.isBinaryExpression(bindingValue, { operator: 'in' })) {
    throw valuePath.buildCodeFrameError(
      `The \`${DIRECTIVES.FOR}\` used on element <${elementUtil(path).getName()}> with invalid binding value. `
      + `Usage example: \`<div ${DIRECTIVES.FOR}={(item, index) in list}>{item}</div>\``
    );
  }
  if (
    !t.isIdentifier(bindingValue.left)
    && (!t.isSequenceExpression(bindingValue.left)
      || !bindingValue.left.expressions.every((n) => t.isIdentifier(n))
    )) {
    throw valuePath.get('left').buildCodeFrameError(
      `The \`${DIRECTIVES.FOR}\` used on element <${elementUtil(path).getName()}> with invalid binding value. `
      + `Usage example: \`<div ${DIRECTIVES.FOR}={(item, index) in list}>{item}</div>\``
    );
  }

  const traverseTarget = bindingValue.right;
  let traverseArgs;

  // 最多2个参数
  if (t.isSequenceExpression(bindingValue.left)) {
    if (bindingValue.left.expressions.length > 2) {
      util.codeFrameWarn(
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
  if (!elementUtil(path).isTopElement()) {
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
