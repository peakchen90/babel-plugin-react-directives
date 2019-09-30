const {
  DIRECTIVES,
  types: t,
  getElementName,
  findSiblingElement,
  findDirectiveAttribute,
  getAttributeValueExpression,
  throwAttributeCodeFrameError
} = require('../shared');

module.exports = function transformIf(path, element) {
  // if指令值绑定值不能为空
  const ifExpression = getAttributeValueExpression(path);
  if (!ifExpression) {
    throw path.buildCodeFrameError(
      `${DIRECTIVES.IF} used on element <${getElementName(element)}> without binding value`
    );
  }

  const traverseList = [
    {
      directive: DIRECTIVES.IF,
      element,
      attr: path
    }
  ];
  const traverseElement = (current) => {
    const next = findSiblingElement(current);
    let attr = findDirectiveAttribute(next, DIRECTIVES.ELSE_IF);
    if (attr) {
      if (!attr.value) {
        throwAttributeCodeFrameError(
          next,
          attr,
          `${DIRECTIVES.ELSE_IF} used on element <${getElementName(next)}> without binding value`
        );
      }
      traverseList.push({
        directive: DIRECTIVES.ELSE_IF,
        element: next,
        attr
      });
      traverseElement(next);
      return;
    }

    attr = findDirectiveAttribute(next, DIRECTIVES.ELSE);
    if (attr) {
      if (attr.value) {
        throwAttributeCodeFrameError(
          next,
          attr,
          `${DIRECTIVES.ELSE} used on element <${getElementName(next)}> should not have a binding value`
        );
      }
      traverseList.push({
        directive: DIRECTIVES.ELSE,
        element: next,
        attr
      });
    }
  };
  traverseElement(element);


  /**
   * transform
   */

  if (traverseList.length === 1) { // only if
    element.replaceWith(t.jSXExpressionContainer(
      t.logicalExpression(
        '&&',
        t.expressionStatement(
          t.unaryExpression(
            '!',
            t.unaryExpression('!', ifExpression, true),
            true
          )
        ).expression,
        element.node
      )
    ));
  } else { // if & else-if
    element.replaceWith(
      t.jSXExpressionContainer(
        traverseList.reduceRight((prev, curr, index) => {
          const attributes = curr.element.node.openingElement.attributes;
          curr.element.node.openingElement.attributes = attributes.filter((attr) => attr !== curr.attr);

          if (!prev) {
            return curr.element.node;
          }
          const test = getAttributeValueExpression(curr.attr);
          const conditionalExpression = t.conditionalExpression(
            test,
            curr.element.node,
            prev.type === 'ConditionalExpression' ? { ...prev } : prev
          );
          if (index > 0) {
            curr.element.remove();
          }
          return conditionalExpression;
        }, null)
      )
    );
  }

  path.remove();
};
