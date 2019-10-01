// babel api
const babelAPI = {
  types: {}
};
const types = babelAPI.types;
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
 * 更新types
 * @param api
 */
function updateAPI(api) {
  Object.keys(api).forEach((key) => {
    if (key === 'types') {
      Object.assign(babelAPI.types, api.types);
    } else {
      babelAPI[key] = api[key];
    }
  });
}

/**
 * 更新opts
 * @param _opts
 */
function updateOpts(_opts = {}) {
  Object.assign(opts, _opts);
}

/**
 * 查找父级的JSXElement
 * @param path
 * @return {NodePath<Node> | null}
 */
function findParentJSXElement(path) {
  if (!path) {
    return null;
  }
  const JSXElement = path.findParent((node) => t.isJSXElement(node));
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
 * 返回JSXAttribute属性名称
 * @param path
 * @return {string | JSXIdentifier|null}
 */
function getAttributeName(path) {
  if (!path || !t.isJSXAttribute(path.node)) {
    return null;
  }
  return path.node.name.name;
}

/**
 * 返回属性值表达式
 * @param attrNode
 * @return {null|*}
 */
function getAttributeValueExpression(attrNode) {
  if (!attrNode) {
    return null;
  }
  const value = attrNode.value;
  if (value) {
    return value.expression || value;
  }
  return null;
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
 * 找出下一个可用的兄弟节点
 * @param path
 * @return {NodePath|null}
 */
function findNextSibling(path) {
  if (!path || !t.isJSXElement(path.node) || !path.inList) {
    return null;
  }

  let key = path.key;
  const nextKey = () => ++key;

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
 * @param attrName
 * @return {Array<JSXAttribute | JSXSpreadAttribute>|(JSXAttribute | JSXSpreadAttribute | null)|null}
 */
function findAttribute(path, attrName) {
  if (!path || !t.isJSXElement(path.node)) {
    return null;
  }

  const attributes = path.node.openingElement.attributes;
  if (!attrName) {
    return attributes;
  }

  const result = attributes.find((attrNode) => (
    t.isJSXAttribute(attrNode)
    && attrNode.name.name === attrName
  ));
  return result || null;
}

/**
 * 抛出JSXAttribute代码帧错误
 * @param parentPath
 * @param target
 * @param errorMsg
 */
function throwAttributeCodeFrameError(parentPath, target, errorMsg) {
  if (!parentPath) {
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
  updateAPI,
  updateOpts,
  findParentJSXElement,
  getElementName,
  getAttributeName,
  getAttributeValueExpression,
  removeJAXAttribute,
  findNextSibling,
  findAttribute,
  throwAttributeCodeFrameError,
  ConditionalElement
};
