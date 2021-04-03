const t = require('@babel/types');
const { default: generator } = require('@babel/generator');

class ElementUtil {
  constructor(path) {
    this.path = path;
    this.node = path && path.node;
    this.isValid = t.isJSXElement(this.node);
  }

  /**
   * 返回标签名
   * @return {string}
   */
  name() {
    const name = this.node.openingElement.name;
    if (t.isIdentifier(name)) {
      return name.name;
    }
    return generator(name).code;
  }

  /**
   * 返回所有的属性NodePath
   * @return {Array<NodePath>}
   */
  attributes() {
    const result = [];
    const attributes = this.node.openingElement.attributes;

    for (let i = 0; i < attributes.length; i++) {
      result.push(this.path.get(`openingElement.attributes.${i}`));
    }

    return result;
  }

  /**
   * 根据属性名返回的找到的第一个属性NodePath(从最后开始查找)
   * @param attrName 属性名称
   * @return {NodePath|null}
   */
  findAttrPath(attrName) {
    const attributes = this.node.openingElement.attributes;
    let index = attributes.length - 1;

    const ns = attrName.split(':');
    const hasNamespace = ns.length > 1;

    while (index >= 0) {
      const attrPath = this.path.get(`openingElement.attributes.${index}`);
      if (t.isJSXAttribute(attrPath.node)) {
        // 使用命名空间的属性
        if (
          hasNamespace
          && t.isJSXNamespacedName(attrPath.node.name)
          && attrPath.node.name.namespace === ns[0]
          && attrPath.node.name.name === ns[1]
        ) {
          return attrPath;
        }

        if (!hasNamespace && attrPath.node.name.name === attrName) {
          return attrPath;
        }
      }
      index--;
    }

    return null;
  }

  /**
   * 找出下一个可用的兄弟节点
   * @return {NodePath|null}
   */
  nextSibling() {
    const getNextSibling = (path) => {
      return path.getSibling(path.key + 1);
    };

    let nextPath = getNextSibling(this.path);
    if (!nextPath.node) {
      return null;
    }

    if (t.isJSXText(nextPath.node)) {
      if (/^\s*$/.test(nextPath.node.value)) {
        nextPath = getNextSibling(nextPath);
      } else {
        return nextPath;
      }
    }

    if (!nextPath.node) {
      return null;
    }
    return nextPath;
  }

  /**
   * 合并属性
   * @param option
   * @return {null|NodePath}
   */
  mergeProps(
    {
      prop, // 属性名(用于合并及修改的属性名)
      directivePath, // 指令属性的NodePath
      find, // 遍历的attribute回调方法，返回值用于判断匹配成功
      getResult // 合并结果回调方法，返回值用于设置到属性名上
    }
  ) {
    const attributes = this.attributes();
    const mergeItems = [];

    let lastAttrIndex = -1; // 最后一个属性位置
    let lastSpreadAttrIndex = -1; // 最后一个spread属性位置

    // 用于find回调设置值
    let _value;
    const setValue = (val) => _value = val;

    for (let i = attributes.length - 1; i >= 0; i--) {
      const attrPath = attributes[i];
      if (attrPath === directivePath) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (t.isJSXSpreadAttribute(attrPath.node)) {
        if (lastSpreadAttrIndex === -1) {
          lastSpreadAttrIndex = i;
        }
        mergeItems.push(attrPath.node.argument);
      } else if (lastAttrIndex === -1 && find(attrPath, setValue)) {
        lastAttrIndex = i;
        if (_value) {
          mergeItems.push(_value);
        }
        break;
      }
    }

    // 创建用于替换属性
    const replacement = t.jsxAttribute(
      t.jsxIdentifier(prop),
      t.jsxExpressionContainer(
        getResult(mergeItems.reverse())
      )
    );

    if (lastAttrIndex >= 0) {
      attributes[lastAttrIndex].remove();
    }
    // 在最后插入替换属性
    this.path.get('openingElement').pushContainer('attributes', replacement);

    return replacement;
  }

  /**
   * 是否是顶层Element
   * @return {null|boolean}
   */
  isTopElement() {
    return !t.isJSXElement(this.path.parent) && !t.isJSXFragment(this.path.parent);
  }
}

module.exports = function elemUtil(path) {
  const elementUtil = new ElementUtil(path);

  return new Proxy(elementUtil, {
    get(target, p, receiver) {
      /* istanbul ignore if: fault tolerant control */
      if (!target.isValid && typeof target[p] === 'function') {
        return () => null;
      }
      return Reflect.get(target, p, receiver);
    }
  });
};
