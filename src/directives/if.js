const {
  DIRECTIVES,
  types: t,
  getElementName,
  findNextSibling,
  findAttribute,
  getAttributeBindingValue,
  throwAttributeCodeFrameError,
  removeJAXAttribute,
  getAttributes,
  buildBooleanExpression,
  ConditionalElement
} = require('../shared');


/**
 * 1. 先找到一个包含if指令的JSXElement，并以它的父节点开始遍历JSXElement
 *    1.1 如果找到包含if指令时，查找其后的else-if及else指令
 *    1.2 在1.1找到的目标指令时，递归查找子节点的if指令，并执行1.1，执行完成后将这次所有的条件语句push到栈中（确保子节点先入栈，遍历时先遍历子节点）
 * 2. 递归查找完成时，将栈里的条件指令依次转为为相应的AST
 */


// 保存遍历列表（二维数组，每个属性是包含一组条件的数组）
let _traverseList = [];


/**
 * 遍历包含 if 指令的 JSXElement
 * @param path
 * @return {Array}
 */
function traverseIf(path) {
  path.traverse({
    JSXElement(nodePath) {
      let attrNode;
      if (
        (attrNode = findAttribute(nodePath, DIRECTIVES.IF))
        // 一个JSXElement不能同时存在2个if指令
        && getAttributes(nodePath).every((item) => (
          item === attrNode
          || item.name.name !== DIRECTIVES.IF
        ))
      ) {
        nodePath.skip(); // 跳过遍历子JSXElement节点

        // eslint-disable-next-line no-use-before-define
        _traverseList.push(traverseConditionalElement(nodePath, attrNode));
      }
    }
  });
  return _traverseList;
}

/**
 * 遍历条件JSXElement
 * @param path
 * @param _result
 * @return {*|Array}
 */
function traverseConditionalElement(path, attrNode, _result) {
  const result = _result || [];

  if (result.length === 0 && attrNode.name.name === DIRECTIVES.IF) {
    if (!attrNode.value) {
      throwAttributeCodeFrameError(
        path,
        attrNode,
        `\`${DIRECTIVES.IF}\` used on element <${getElementName(path)}> without binding value`
      );
    }
    traverseIf(path);
    result.push(new ConditionalElement(
      DIRECTIVES.IF,
      path,
      attrNode
    ));
  }

  // 查找else-if指令
  const nextPath = findNextSibling(path);
  attrNode = findAttribute(nextPath, DIRECTIVES.ELSE_IF);
  if (attrNode) {
    if (!attrNode.value) {
      throwAttributeCodeFrameError(
        nextPath,
        attrNode,
        `\`${DIRECTIVES.ELSE_IF}\` used on element <${getElementName(nextPath)}> without binding value`
      );
    }
    traverseIf(nextPath);
    result.push(new ConditionalElement(
      DIRECTIVES.ELSE_IF,
      nextPath,
      attrNode
    ));
    return traverseConditionalElement(nextPath, attrNode, result);
  }

  // 查找else指令
  attrNode = findAttribute(nextPath, DIRECTIVES.ELSE);
  if (attrNode) {
    if (attrNode.value) {
      throwAttributeCodeFrameError(
        nextPath,
        attrNode,
        `\`${DIRECTIVES.ELSE}\` used on element <${getElementName(nextPath)}> should not have a binding value`
      );
    }
    traverseIf(nextPath);
    result.push(new ConditionalElement(
      DIRECTIVES.ELSE,
      nextPath,
      attrNode
    ));
  }
  return result;
}

/**
 * 转换一组条件语句
 * @param conditions
 */
function transform(conditions) {
  const current = conditions[0];
  const path = current.path;
  const attrNode = current.attrNode;

  // 移出 if 属性
  removeJAXAttribute(path, attrNode);

  // 根节点使用 if 指令
  if (!t.isJSXElement(path.parent) && !t.isJSXFragment(path.parent)) {
    path.replaceWith(
      t.logicalExpression(
        '&&',
        buildBooleanExpression(
          getAttributeBindingValue(attrNode)
        ),
        path.node
      )
    );
    return;
  }

  path.replaceWith(
    t.jSXExpressionContainer(
      conditions.reduceRight((prev, curr) => {
        removeJAXAttribute(curr.path, curr.attrNode);

        const test = getAttributeBindingValue(curr.attrNode);

        if (!prev) {
          // 最后一个节点是else
          if (curr.directive === DIRECTIVES.ELSE) {
            return {
              expression: curr.path.node,
              removed: curr.path
            };
          }
          return {
            expression: t.conditionalExpression(
              test,
              curr.path.node,
              t.identifier('null')
            ),
            removed: curr.path
          };
        }

        const conditionalExpression = t.conditionalExpression(
          test,
          curr.path.node,
          prev.expression
        );
        prev.removed.remove();

        return {
          expression: conditionalExpression,
          removed: curr.path
        };
      }, null).expression
    )
  );
}

/**
 * 转换if指令
 * @param traverseList
 */
function transformIf(path) {
  if (findAttribute(path, DIRECTIVES.IF)) {
    _traverseList = [];
    traverseIf(path.parentPath);

    _traverseList.forEach((conditions) => transform(conditions));
  }
}

module.exports = transformIf;
