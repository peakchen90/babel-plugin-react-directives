const assert = require('assert');
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
   * @param attrName 属性名称
   * @param isFindLast 是否从最后开始查找，默认true
   * @return {null|NodePath}
   */
  findAttributeByName(attrName, isFindLast = true) {
    /* istanbul ignore if: fault tolerant control */
    if (!this._isValid) {
      return null;
    }

    const attributes = this.path.node.openingElement.attributes;
    let index = isFindLast ? attributes.length - 1 : 0;

    while (isFindLast ? index >= 0 : index < attributes.length) {
      const attrPath = this.path.get(`openingElement.attributes.${index}`);
      if (t.isJSXAttribute(attrPath.node) && attrPath.node.name.name === attrName) {
        return attrPath;
      }
      if (isFindLast) {
        index--;
      } else {
        index++;
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

    let nextPath = this.path.getNextSibling();
    /* istanbul ignore if: fault tolerant control */
    if (!nextPath) {
      return null;
    }

    if (t.isJSXText(nextPath.node)) {
      if (/\S/.test(nextPath.node.value)) {
        return null;
      }
      nextPath = nextPath.getNextSibling();
    }

    if (t.isJSXElement(nextPath.node)) {
      return nextPath;
    }

    return null;
  }

  /**
   * 合并属性
   * @param option
   * @return {null|NodePath}
   */
  mergeAttributes(option = {}) {
    /* istanbul ignore if: fault tolerant control */
    if (!this._isValid) {
      return null;
    }

    const {
      attrName, // 属性名
      directivePath, // 指令属性的NodePath
      callback, // 遍历的attribute回调方法，返回值用于判断匹配成功
      getMergeResult, // 合并结果回调方法，返回值用于设置到属性上
    } = option;

    assert(attrName && typeof attrName === 'string', 'The `attrName` expects a non-empty string');
    assert(t.isJSXAttribute(directivePath), 'The `directivePath` expects a JSXAttribute');
    assert(typeof callback === 'function', 'The `callback` expects a function');
    assert(typeof getMergeResult === 'function', 'The `getMergeResult` expects a function');

    const attributes = this.findAllAttributes();
    const mergeItems = [];

    let lastAttrIndex = -1; // 最后一个属性位置
    let lastSpreadAttrIndex = -1; // 最后一个spread属性位置

    // 用于callback回调设置值
    let _value;
    const setValue = (val) => _value = val;

    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i];
      if (attr === directivePath) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (t.isJSXSpreadAttribute(attr.node)) {
        if (lastSpreadAttrIndex === -1) {
          lastSpreadAttrIndex = i;
        }
        mergeItems.push(
          t.logicalExpression(
            '&&',
            attr.node.argument,
            t.memberExpression(
              attr.node.argument,
              t.identifier(attrName)
            )
          )
        );
      } else if (lastAttrIndex === -1 && callback(attr, setValue)) {
        lastAttrIndex = i;
        if (_value) {
          mergeItems.push(_value);
        }
      }
    }

    // 创建用于替换属性
    const replacement = t.jsxAttribute(
      t.jSXIdentifier(attrName),
      t.jSXExpressionContainer(
        getMergeResult(mergeItems.reverse())
      )
    );

    if (lastAttrIndex >= 0) {
      attributes[lastAttrIndex].remove();
    }
    if (!directivePath.removed) {
      directivePath.remove();
    }
    // 在最后插入替换属性
    this.path.get('openingElement').pushContainer('attributes', replacement);

    return replacement;
  }
}


module.exports = function elementUtil(path) {
  return new ElementUtil(path);
};
