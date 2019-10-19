const { codeFrameColumns } = require('@babel/code-frame');
const t = require('@babel/types');
const assert = require('assert');
const chalk = require('chalk');
const semver = require('semver');


/**
 * 打印附带代码位置的警告信息
 * @param path
 * @param message
 */
function codeFrameWarn(path, message) {
  // jest测试时忽略
  if (process.env.JEST_TEST_ENV) {
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
 * 断言babel版本是否支持
 * @param version
 * @param range
 */
function assertVersion(version, range) {
  assert(
    semver.minSatisfying([version], range),
    `Requires Babel "${range}", but was loaded with ${version}.`
  );
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

  /* istanbul ignore if: fault tolerant control */
  if (!path) {
    return bindingStack;
  }

  /* istanbul ignore if: fault tolerant control */
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
      return bindingStack;
    }

    bindingStack = [
      ...getMemberPathStack(
        binding.path.get('init')
      ),
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
  getMemberPathStack,
  findDeconstructionPathStack,
  getReferenceStack
};
