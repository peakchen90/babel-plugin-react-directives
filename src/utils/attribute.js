const { types: t } = require('../shared');


class AttributeUtil {
  constructor(path) {
    this.path = path;
    this._isValid = t.isJSXAttribute(path && path.node);
  }

  /**
   * 返回属性名称
   * @return {string | null}
   */
  getName() {
    /* istanbul ignore if: fault tolerant control */
    if (!this._isValid) {
      return null;
    }
    return this.path.node.name.name;
  }

  /**
   * 返回属性值表达式
   * @return {expression | null}
   */
  getValueExpression() {
    /* istanbul ignore if: fault tolerant control */
    if (!this._isValid) {
      return null;
    }
    const value = this.path.node.value;
    if (value) {
      return value.expression || value;
    }
    return null;
  }

  /**
   * 返回对应的JSXElement
   * @return {JSXElement | null}
   */
  getJSXElement() {
    /* istanbul ignore if: fault tolerant control */
    if (!this._isValid) {
      return null;
    }
    return this.path.findParent((_path) => t.isJSXElement(_path.node));
  }
}


module.exports = function attrUtil(path) {
  return new AttributeUtil(path);
};
