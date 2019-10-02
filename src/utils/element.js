const { types: t } = require('../shared');


class ElementUtil {
  constructor(path) {
    this.path = path;
    this._isValid = t.isJSXElement(path && path.node);
  }

  /**
   * 返回标签名
   * @return {string|null}
   */
  getName() {
    /* istanbul ignore if: fault tolerant control */
    if (!this._isValid) {
      return null;
    }
    return this.path.node.openingElement.name.name;
  }

  /**
   * 返回所有的属性NodePath
   * @return {null|Array<NodePath>>}
   */
  findAllAttributes() {
    /* istanbul ignore if: fault tolerant control */
    if (!this._isValid) {
      return null;
    }

    const result = [];
    const attributes = this.path.node.openingElement.attributes;

    for (let i = 0; i < attributes.length; i++) {
      result.push(this.path.get(`openingElement.attributes.${i}`));
    }

    return result;
  }

  /**
   * 根据属性名返回的找到的第一个属性NodePath
   * @param attrName
   * @return {null|NodePath}
   */
  findAttributeByName(attrName) {
    /* istanbul ignore if: fault tolerant control */
    if (!this._isValid) {
      return null;
    }

    const attributes = this.path.node.openingElement.attributes;

    for (let i = 0; i < attributes.length; i++) {
      const attrPath = this.path.get(`openingElement.attributes.${i}`);
      if (t.isJSXAttribute(attrPath.node) && attrPath.node.name.name === attrName) {
        return attrPath;
      }
    }

    return null;
  }

  /**
   * 找出下一个可用的兄弟节点
   * @return {NodePath|null}
   */
  findNextSibling() {
    /* istanbul ignore if: fault tolerant control */
    if (!this._isValid) {
      return null;
    }

    let key = this.path.key;
    const nextKey = () => ++key;

    let nextPath = this.path.getSibling(nextKey());
    /* istanbul ignore if: fault tolerant control */
    if (!nextPath) {
      return null;
    }

    if (t.isJSXText(nextPath.node)) {
      if (/\S/.test(nextPath.node.value)) {
        return null;
      }
      nextPath = this.path.getSibling(nextKey());
    }

    if (t.isJSXElement(nextPath.node)) {
      return nextPath;
    }

    return null;
  }
}


module.exports = function elementUtil(path) {
  return new ElementUtil(path);
};
