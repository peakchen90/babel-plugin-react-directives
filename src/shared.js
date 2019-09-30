// babel-types
const types = {};
const t = types;

// plugin option
const opts = {
  prefix: 'rd'
};

// 指令名
const DIRECTIVES = {
  get IF() {
    return `${opts.prefix}-if`;
  },
  get ELSE() {
    return `${opts.prefix}-else`;
  },
  get ELSE_IF() {
    return `${opts.prefix}-else-if`;
  },
  get SHOW() {
    return `${opts.prefix}-show`;
  },
  get FOR() {
    return `${opts.prefix}-for`;
  },
  get MODEL() {
    return `${opts.prefix}-model`;
  }
};

/**
 * 更新opts
 * @param _opts
 */
function updateOpts(_opts = {}) {
  Object.assign(opts, _opts);
}

/**
 * 更新types
 * @param babelTypes
 */
function updateTypes(babelTypes) {
  Object.assign(t, babelTypes);
}

/**
 * 查找父级的JSXElement
 * @param path
 * @return {NodePath<Node> | null}
 */
function findParentElement(path) {
  const JSXElement = path.findParent((parent) => parent.type === 'JSXElement');
  return JSXElement || null;
}

/**
 * 返回JSXElement标签名称
 * @param path
 * @return {string | JSXIdentifier|null}
 */
function getElementName(path) {
  if (!path || !t.isJSXElement(path.node)) {
    return null;
  }
  return path.node.openingElement.name.name;
}

/**
 * 找出下一个可用的兄弟节点
 * @param path
 * @param findNext 查找下一个，默认true，false表示查找上一个
 * @return {NodePath|null}
 */
function findNextSibling(path, findNext = true) {
  if (!path || !t.isJSXElement(path.node) || !path.inList) {
    return null;
  }

  let key = path.key;
  const nextKey = () => {
    key += (findNext ? 1 : -1);
    return key;
  };

  let next = path.getSibling(nextKey());
  if (!next) {
    return null;
  }

  if (t.isJSXText(next.node)) {
    if (/\S/.test(next.node.value)) {
      return null;
    }
    next = path.getSibling(nextKey());
  }

  if (t.isJSXElement(next.node)) {
    return next;
  }

  return null;
}

/**
 * 找到JSXElement的指令属性
 * @param path
 * @param directive
 * @return {(JSXAttribute | JSXSpreadAttribute | null)|null}
 */
function findDirectiveAttribute(path, directive) {
  if (!path || !t.isJSXElement(path.node)) {
    return null;
  }

  const result = path.node.openingElement.attributes.find((attrbute) => (
    attrbute.type === 'JSXAttribute'
    && attrbute.name.name === directive
  ));
  return result || null;
}

/**
 * 返回属性值表达式
 * @param path
 * @return {null|*}
 */
function getAttributeValueExpression(path) {
  if (!path) {
    return null;
  }

  let value;
  if (path.value) {
    value = path.value;
  } else if (path.node && path.node.value) {
    value = path.node.value;
  }
  if (value) {
    return value.expression || value;
  }
  return null;
}

/**
 * 抛出JSXAttribute代码帧错误
 * @param parentPath
 * @param target
 * @param errorMsg
 */
function throwAttributeCodeFrameError(parentPath, target, errorMsg) {
  if (!parentPath || !t.isJSXElement(parentPath.node)) {
    return;
  }
  parentPath.traverse({
    JSXAttribute(path) {
      if (path.node === target) {
        throw path.buildCodeFrameError(errorMsg);
      }
    }
  });
}

/**
 * 移出JSX指定属性
 * @param path
 * @param attrNode
 */
function removeJAXAttribute(path, attrNode) {
  if (t.isJSXElement(path)) {
    const attributes = path.node.openingElement.attributes;
    path.node.openingElement.attributes = attributes.filter((attr) => attr !== attrNode);
  }
}

/**
 * 条件指令Element
 */
class ConditionalElement {
  constructor(directive, path, attrNode) {
    this.directive = directive;
    this.path = path;
    this.attrNode = attrNode;
  }
}

module.exports = {
  DIRECTIVES,
  types,
  updateOpts,
  updateTypes,
  findParentElement,
  getElementName,
  findNextSibling,
  findDirectiveAttribute,
  getAttributeValueExpression,
  throwAttributeCodeFrameError,
  removeJAXAttribute,
  ConditionalElement
};
