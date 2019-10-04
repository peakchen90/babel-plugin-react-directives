const { codeFrameColumns } = require('@babel/code-frame');
const assert = require('assert');
const chalk = require('chalk');
const { types: t } = require('../shared');


/**
 * 打印附带代码位置的警告信息
 * @param path
 * @param message
 */
function codeFrameWarn(path, message) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  /* istanbul ignore next: print warn info */
  console.log(chalk.yellow(`[Warn]: ${message}`));

  /* istanbul ignore next: print warn info */
  if (path && path.hub && path.node) {
    const code = path.hub.file.code;
    console.log(codeFrameColumns(
      code,
      path.node.loc,
      {
        highlightCode: true,
        linesAbove: 2,
        linesBelow: 3
      }
    ));
  }
}

/**
 * 判断版本是否支持
 * @param currentVersion
 * @param targetVersion
 * @param message
 */
function assertVersion(currentVersion, targetVersion, message) {
  const current = currentVersion.split('.').map((item) => Number(item));
  let target = [];
  if (typeof targetVersion === 'number') {
    target = [targetVersion];
  } else if (typeof targetVersion === 'string' && /^(\d+)(\.\d+)*$/.test(targetVersion)) {
    target = targetVersion.split('.').map((item) => Number(item));
  } else {
    throw new Error('invalid version');
  }

  const lenDiff = current.length - target.length;
  if (lenDiff > 0) {
    target.push(...Array(lenDiff).fill(0));
  }

  assert(
    target.some((item, index) => {
      const curr = current[index];
      if (curr === undefined || item < curr) return true;
      if (item > curr) return true;
      return index === target.length - 1;
    }),
    message || `The version supported: > ${targetVersion}`
  );
}

/**
 * 获取节点的源代码
 * @param path
 * @param node
 * @return {string|null}
 */
function getSourceCode(path, node) {
  /* istanbul ignore if: fault tolerant control */
  if (!path || !path.hub) {
    return null;
  }
  let code = path.hub.file.code;
  if (node && node.start != null && node.end != null) {
    return code = code.substring(node.start, node.end);
  }
  return code;
}

/**
 * 返回一个对象的成员访问栈，如: a.b.c 返回 [pathA, pathB, pathC] 数组元素为对应的NodePath
 * @param path
 * @return {Array<NodePath>}
 */
function getMemberPathStack(path) {
  const stack = [];
  while (t.isMemberExpression(path && path.node)) {
    stack.push(path.get('property'));
    path = path.get('object');
  }
  if (path && path.node && path.hub) { // 简单判断是一个NodePath对象
    stack.push(path);
  }
  return stack.reverse();
}

/**
 * 找到一个变量在一个数组或对象的解构栈，如: let { a, b: [c] } = obj 中变量c的解构栈返回: [pathB, NumericLiteral(0)]
 * @param path
 * @param identifier
 * @return {Array<NodePath>}
 */
function findDeconstructionPathStack(path, identifierName) {
  if (!t.isObjectPattern(path && path.node) && !t.isArrayPattern(path && path.node)) {
    return [];
  }

  const stack = [];
  let targetPath = null;
  const nestedVisitor = {
    Identifier(_path) {
      if (
        _path.node.name === identifierName
        && (
          (t.isObjectProperty(_path.parent) && _path.parent.value === _path.node)
          || t.isArrayPattern(_path.parent)
        )
      ) {
        targetPath = _path;
        // Note: 这里不能停止遍历，要找出可能的最后一个标识符
      }
    }
  };

  path.traverse(nestedVisitor);

  if (targetPath) {
    while (targetPath !== path) {
      if (t.isObjectProperty(targetPath.parent)) {
        stack.push(targetPath.parentPath.get('key'));
        targetPath = targetPath.parentPath && targetPath.parentPath.parentPath;
      } else if (t.isArrayPattern(targetPath.parent)) {
        const index = targetPath.parent.elements.indexOf(targetPath.node);
        // 创建一个类PathNode对象(不能遍历)
        const likeNumericLiteral = Object.create(Object.getPrototypeOf(targetPath));
        likeNumericLiteral.node = {
          ...t.numericLiteral(index),
          start: targetPath.node.start,
          end: targetPath.node.end,
          loc: targetPath.node.loc,
        };
        likeNumericLiteral.hub = targetPath.hub;
        likeNumericLiteral.scope = targetPath.scope;
        likeNumericLiteral.type = likeNumericLiteral.node.type;
        stack.push(likeNumericLiteral);
        targetPath = targetPath.parentPath;
      } else {
        break;
      }
    }
  }

  return stack.reverse();
}

/**
 * 返回一个变量或成员表达式引用的对象成员栈
 * @param attrPath
 * @param bindingValuePath
 * @return {[]}
 */
function getReferenceStack(path) {
  let bindingStack = [];

  if (!path) {
    return bindingStack;
  }

  if (t.isIdentifier(path.node)) {
    const identifierName = path.node.name;
    let binding = path.scope.bindings[identifierName];

    if (!binding) {
      const targetPath = path.findParent((p) => (
        !!p.scope.bindings[identifierName]
      ));
      if (targetPath) {
        binding = targetPath.scope.bindings[identifierName];
      }
    }

    if (!binding) {
      throw path.buildCodeFrameError(
        `\`${identifierName}\` is not defined`
      );
    }

    bindingStack = [
      ...getMemberPathStack(binding.path.get('init')),
      ...findDeconstructionPathStack(
        binding.path.get('id'),
        identifierName
      )
    ];
  } else if (t.isMemberExpression(path.node)) {
    bindingStack = getMemberPathStack(path);
  }

  // 判断最后一个标识符是否引用了其他值
  let first = bindingStack[0];
  while (first && !t.isThisExpression(first.node)) {
    const refsStack = getReferenceStack(first);
    first = refsStack[0];
    if (refsStack.length > 0) {
      bindingStack.splice(0, 1, ...refsStack);
    }
  }

  return bindingStack;
}

module.exports = {
  codeFrameWarn,
  assertVersion,
  getSourceCode,
  getMemberPathStack,
  findDeconstructionPathStack,
  getReferenceStack
};
