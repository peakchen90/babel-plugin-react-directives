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
 * 返回一个对象的成员访问栈，如: a.b.c 返回 [expA, expB, expC] 数组元素为对应的表达式
 * @param exp
 * @return {*[]}
 */
function getMemberStack(exp) {
  const stack = [];
  while (t.isMemberExpression(exp)) {
    stack.push(exp.property);
    exp = exp.object;
  }
  if (exp) {
    stack.push(exp);
  }
  return stack.reverse();
}

/**
 * 找到一个变量在一个数组或对象的解构栈，如: let { a, b: [c] } = obj 中变量c的解构栈返回: [expB, NumericLiteral(0)]
 * @param path
 * @param identifier
 * @return {[]}
 */
function findDeconstructionStack(path, identifierName) {
  if (!t.isObjectPattern(path && path.node) && !t.isArrayPattern(path && path.node)) {
    return [];
  }

  // const { a: [b], c} = this.state.dataA;
  const stack = [];
  let targetPath = null;
  const nestedVisitor = {
    Identifier(_path) {
      if (
        _path.node.name === identifierName
        && (
          (t.isObjectProperty(_path.parent)
            && _path.parent.value === _path.node)
          || t.isArrayPattern(_path.parent)
        )
      ) {
        targetPath = _path;
      }
    }
  };
  path.traverse(nestedVisitor);

  if (targetPath) {
    while (targetPath !== path) {
      if (t.isObjectProperty(targetPath.parent)) {
        stack.push(targetPath.parent.key);
        targetPath = targetPath.parentPath && targetPath.parentPath.parentPath;
      } else if (t.isArrayPattern(targetPath.parent)) {
        const index = targetPath.parent.elements.indexOf(targetPath.node);
        stack.push(t.numericLiteral(index));
        targetPath = targetPath.parentPath;
      } else {
        break;
      }
    }
  }

  return stack.reverse();
}

module.exports = {
  codeFrameWarn,
  assertVersion,
  getSourceCode,
  getMemberStack,
  findDeconstructionStack
};
