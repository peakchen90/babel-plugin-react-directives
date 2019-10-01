const {
  DIRECTIVES,
  types: t,
  findAttribute,
  getAttributeBindingValue,
  throwAttributeCodeFrameError,
  traverseAttributes,
  getElementName,
  getAttributeName
} = require('../shared');


/**
 * 转换show指令
 * @param path
 */
function transformShow(path) {
  const attrNode = findAttribute(path, DIRECTIVES.SHOW);
  if (!attrNode) {
    return;
  }

  const bindingValue = getAttributeBindingValue(attrNode);
  if (!bindingValue) {
    throw throwAttributeCodeFrameError(
      path,
      attrNode,
      `\`${DIRECTIVES.SHOW}\` used on element <${getElementName(path)}> without binding value`
    );
  }

  const attributes = traverseAttributes(path);
  const spreadItems = [
    // 定义对象属性 display: bindingValue ? undefined : 'none'
    t.objectProperty(
      t.identifier('display'),
      t.conditionalExpression(
        bindingValue,
        t.identifier('undefined'),
        t.stringLiteral('none')
      )
    )
  ];

  let lastStyleIndex = -1; // 最后一个style位置
  let lastSpreadAttrIndex = -1; // 最后一个spread属性位置
  let targetPath = null; // 指令show的NodePath

  for (let i = attributes.length - 1; i >= 0; i--) {
    const attr = attributes[i];

    if (attr.node === attrNode) {
      targetPath = attr;
    } else if (t.isJSXSpreadAttribute(attr.node)) {
      if (lastSpreadAttrIndex === -1) {
        lastSpreadAttrIndex = i;
      }
      //  {...foo}  ===>>>  (foo && foo.style)
      spreadItems.push(
        t.spreadElement(
          t.logicalExpression(
            '&&',
            attr.node.argument,
            t.memberExpression(
              attr.node.argument,
              t.identifier('style')
            )
          )
        )
      );
    } else if (lastStyleIndex === -1 && getAttributeName(attr) === 'style') {
      lastStyleIndex = i;

      const value = getAttributeBindingValue(attr.node);
      if (t.isStringLiteral(value)) {
        throw attr.buildCodeFrameError(
          'The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}}'
        );
      }
      spreadItems.push(
        t.spreadElement(value)
      );
    } else if (lastStyleIndex === -1 && /^(style)$/i.test(getAttributeName(attr))) { // 非小写`style`属性的样式会被忽略
      throw attr.buildCodeFrameError(
        `The \`style\` prop should be lowercase, but received: \`${RegExp.$1}\``
      );
    }
  }

  // 创建属性 style={{ ...spreadItems}}
  const style = t.jsxAttribute(
    t.jSXIdentifier('style'),
    t.jSXExpressionContainer(
      t.objectExpression(spreadItems.reverse())
    )
  );
  if (lastSpreadAttrIndex === -1 && lastStyleIndex === -1) { // 不存在其他style属性
    targetPath.replaceWith(style);
  } else if (
    lastSpreadAttrIndex === -1
    || lastStyleIndex > lastSpreadAttrIndex
  ) { // 存在一个style属性 或者style属性在spread属性之后，用该style节点替换
    attributes[lastStyleIndex].replaceWith(style);
    targetPath.remove();
  } else { // 在spread属性后插入
    attributes[lastSpreadAttrIndex].insertAfter(style);
    targetPath.remove();
    // 移出已存在的style属性
    if (lastStyleIndex !== -1) {
      attributes[lastStyleIndex].remove();
    }
  }
}

module.exports = transformShow;
