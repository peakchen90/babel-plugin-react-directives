const t = require('@babel/types');


class AttributeUtil {
  constructor(path) {
    this.path = path;
    this.node = path && path.node;
    this.isValid = t.isJSXAttribute(this.node);
  }

  /**
   * 返回属性名称
   * @return {string}
   */
  name() {
    // such as: <div abc:def="" />
    if (t.isJSXNamespacedName(this.node.name)) {
      return `${this.node.name.namespace}.${this.node.name.name}`;
    }
    return this.node.name.name;
  }

  /**
   * 返回属性值NodePath
   * @return {NodePath|null}
   */
  valuePath() {
    if (this.node.value === null) {
      return null;
    }
    if (t.isJSXExpressionContainer(this.node.value)) {
      if (t.isExpression(this.node.value.expression)) {
        return this.path.get('value.expression');
      }
      return null;
    }
    if (this.node.value !== null) {
      return this.path.get('value');
    }
    return null;
  }

  /**
   * 返回属性值表达式
   * @return {Node|null}
   */
  valueExpr() {
    const valuePath = this.valuePath();
    if (valuePath) {
      return valuePath.node || null;
    }
    return null;
  }

  /**
   * 返回对应的JSXElement
   * @return {JSXElement}
   */
  JSXElement() {
    return this.path.findParent(
      (_path) => t.isJSXElement(_path.node)
    );
  }
}


module.exports = function attrUtil(path) {
  const attributeUtil = new AttributeUtil(path);

  return new Proxy(attributeUtil, {
    get(target, p, receiver) {
      /* istanbul ignore if: fault tolerant control */
      if (!target.isValid && typeof target[p] === 'function') {
        return () => null;
      }
      return Reflect.get(target, p, receiver);
    }
  });
};
