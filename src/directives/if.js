const {
  DIRECTIVES,
  types: t,
  getElementName,
  findNextSibling,
  findAttribute,
  getAttributeValueExpression,
  throwAttributeCodeFrameError,
  removeJAXAttribute,
  ConditionalElement
} = require('../shared');


/**
 * 1. 先找到一个包含if指令的JSXElement，并以它的父节点开始遍历JSXElement
 *    1.1 如果找到包含if指令时，查找其后的else-if及else指令
 *    1.2 在1.1找到的目标指令时，递归查找子节点的if指令，并执行1.1，执行完成后将这次所有的条件语句push到栈中（确保子节点先入栈，遍历时先遍历子节点）
 * 2. 递归查找完成时，将栈里的条件指令依次转为为相应的AST
 *
 * 注：递归查找JSXElement时，标记已经遍历过的节点，防止重复遍历
 */


// 是否已经遍历过
const HAS_TRAVERSED = '[[__HAS_TRAVERSED__]]';

let _traverseList = [];


/**
 * 遍历包含 if 指令的 JSXElement
 * @param nodePath
 * @param reset
 * @return {Array}
 */
function traverseIf(nodePath, reset = false) {
  if (reset) {
    _traverseList = [];
  }
  nodePath[HAS_TRAVERSED] = true;

  nodePath.traverse({
    JSXElement(path) {
      if (!path[HAS_TRAVERSED] && findAttribute(path, DIRECTIVES.IF)) {
        // eslint-disable-next-line no-use-before-define
        _traverseList.push(traverseConditionalElement(path));
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
function traverseConditionalElement(path, _result) {
  const result = _result || [];

  let attr;
  // eslint-disable-next-line no-cond-assign
  if (result.length === 0 && (attr = findAttribute(path, DIRECTIVES.IF))) {
    if (!attr.value) {
      throwAttributeCodeFrameError(
        path,
        attr,
        `${DIRECTIVES.IF} used on elementPath <${getElementName(path)}> without binding value`
      );
    }
    traverseIf(path);
    result.push(new ConditionalElement(
      DIRECTIVES.IF,
      path,
      attr
    ));
  }

  // 如果第一个条件不是if语句，直接返回
  if (result.length === 0) {
    return result;
  }

  // 查找else-if指令
  const nextPath = findNextSibling(path);
  attr = findAttribute(nextPath, DIRECTIVES.ELSE_IF);
  if (attr) {
    if (!attr.value) {
      throwAttributeCodeFrameError(
        nextPath,
        attr,
        `${DIRECTIVES.ELSE_IF} used on elementPath <${getElementName(nextPath)}> without binding value`
      );
    }
    traverseIf(nextPath);
    result.push(new ConditionalElement(
      DIRECTIVES.ELSE_IF,
      nextPath,
      attr
    ));
    return traverseConditionalElement(nextPath, result);
  }

  // 查找else指令
  attr = findAttribute(nextPath, DIRECTIVES.ELSE);
  if (attr) {
    if (attr.value) {
      throwAttributeCodeFrameError(
        nextPath,
        attr,
        `${DIRECTIVES.ELSE} used on elementPath <${getElementName(nextPath)}> should not have a binding value`
      );
    }
    traverseIf(nextPath);
    result.push(new ConditionalElement(
      DIRECTIVES.ELSE,
      nextPath,
      attr
    ));
  }
  return result;
}

/**
 * 转换一组条件语句
 * @param conditions
 */
function transform(conditions) {
  const target = conditions[0];
  const targetPath = target.path;
  const targetAttrNode = target.attrNode;

  // 移出 if 属性
  removeJAXAttribute(targetPath, targetAttrNode);

  // 根节点使用 if 指令
  if (!t.isJSXElement(targetPath.parent) && !t.isJSXFragment(targetPath.parent)) {
    targetPath.replaceWith(
      t.logicalExpression(
        '&&',
        t.expressionStatement(
          t.unaryExpression('!', t.unaryExpression('!', getAttributeValueExpression(targetAttrNode), true), true)
        ).expression,
        targetPath.node
      )
    );
    return;
  }

  targetPath.replaceWith(
    t.jSXExpressionContainer(
      conditions.reduceRight((prev, curr) => {
        const test = getAttributeValueExpression(curr.attrNode);
        removeJAXAttribute(curr.path, curr.attrNode);

        if (!prev) {
          // 最后一个节点是else
          if (curr.directive === DIRECTIVES.ELSE) {
            return {
              expression: curr.path.node,
              removed: curr.path
            };
          }
          return {
            expression: t.expressionStatement(
              t.conditionalExpression(
                test,
                curr.path.node,
                t.identifier('null')
              )
            ).expression,
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
          expression: t.expressionStatement(conditionalExpression).expression,
          removed: curr.path
        };
      }, null).expression
    )
  );
}

/**
 * 转换
 * @param traverseList
 */
function transformIf(traverseList) {
  traverseList.forEach((conditions) => {
    if (conditions.length > 0) {
      transform(conditions);
    }
  });
}

module.exports = {
  traverseIf,
  transformIf
};
