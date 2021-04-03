const t = require('@babel/types');
const { DIRECTIVES } = require('../shared');
const attrUtil = require('../utils/attribute');
const elemUtil = require('../utils/element');
const { codeFrameWarn } = require('../utils/util');

/**
 * 条件指令的信息
 */
class Condition {
  constructor(directive, path, attrPath) {
    this.directive = directive;
    this.path = path;
    this.attrPath = attrPath;
  }
}

/**
 * 1. 先找到一个包含if指令的JSXElement，并以它的父节点开始遍历JSXElement
 *    1.1 如果找到包含if指令时，查找其后的else-if及else指令
 *    1.2 在1.1找到的目标指令时，递归查找子节点的if指令，并执行1.1，执行完成后将这次所有的条件语句push到栈中（确保子节点先入栈，遍历时先遍历子节点）
 * 2. 递归查找完成时，将栈里的每组条件指令依次转为为对应的条件表达式
 */

/**
 * 保存遍历列表（二维数组，每个属性是包含一组条件的数组）
 */
let traverseList = [];

/**
 * 遍历包含 if 指令的 JSXElement
 * @param path
 * @return {Array}
 */
function traverseIf(path) {
  const nestedVisitor = {
    JSXElement(_path) {
      const attributes = elemUtil(_path).attributes();
      const attrs = attributes.filter((attr) => attrUtil(attr).name() === DIRECTIVES.IF);
      if (attrs.length === 1) {
        _path.stop(); // 跳过遍历子节点
        traverseList.push(traverseCondition(_path, attrs[0]));
      }
    }
  };

  path.traverse(nestedVisitor);

  return traverseList;
}

/**
 * 遍历一组条件JSXElement
 * @param path
 * @param attrPath
 * @param _lastResult
 * @return {*|Array}
 */
function traverseCondition(path, attrPath, _lastResult) {
  const result = _lastResult || [];

  if (result.length === 0 && attrUtil(attrPath).name() === DIRECTIVES.IF) {
    if (!attrUtil(attrPath).valueExpr()) {
      throw attrPath.buildCodeFrameError(
        `\`${DIRECTIVES.IF}\` used on element <${elemUtil(path).name()}> without binding value.`
      );
    }
    traverseIf(path);
    result.push(new Condition(DIRECTIVES.IF, path, attrPath));
  }

  // 查找else-if指令
  path = elemUtil(path).nextSibling();
  attrPath = elemUtil(path).findAttrPath(DIRECTIVES.ELSE_IF);
  if (attrPath) {
    if (!attrUtil(attrPath).valueExpr()) {
      throw attrPath.buildCodeFrameError(
        `\`${DIRECTIVES.ELSE_IF}\` used on element <${elemUtil(path).name()}> without binding value.`
      );
    }
    traverseIf(path);
    result.push(new Condition(DIRECTIVES.ELSE_IF, path, attrPath));
    return traverseCondition(path, attrPath, result);
  }

  // 查找else指令
  attrPath = elemUtil(path).findAttrPath(DIRECTIVES.ELSE);
  if (attrPath) {
    if (attrUtil(attrPath).valueExpr()) {
      codeFrameWarn(
        attrPath,
        `\`${DIRECTIVES.ELSE}\` used on element <${elemUtil(path).name()}> should not have a binding value`
      );
    }
    traverseIf(path);
    result.push(new Condition(DIRECTIVES.ELSE, path, attrPath));
  }

  return result;
}

/**
 * 转换一组条件语句
 * @param conditions
 */
function transform(conditions) {
  // 第一个为if条件，找到并移出if属性
  const directiveData = conditions[0];
  const path = directiveData.path;
  const attrPath = directiveData.attrPath;

  // 顶层元素
  if (elemUtil(path).isTopElement()) {
    path.replaceWith(
      t.conditionalExpression(
        attrUtil(attrPath).valueExpr(),
        path.node,
        t.nullLiteral()
      )
    );
    attrPath.remove();
    return;
  }

  path.replaceWith(
    t.jsxExpressionContainer(
      conditions.reduceRight((prev, curr, index) => {
        const testExpr = attrUtil(curr.attrPath).valueExpr();

        let expression;
        if (!prev) {
          // 最后一个节点是else
          if (curr.directive === DIRECTIVES.ELSE) {
            expression = curr.path.node;
          } else {
            expression = t.conditionalExpression(
              testExpr,
              curr.path.node,
              t.nullLiteral()
            );
          }
        } else {
          expression = t.conditionalExpression(
            testExpr,
            curr.path.node,
            prev
          );
        }
        curr.attrPath.remove();
        if (index > 0) { // 移出非if指令所在的JSXElement（if指令所在的节点用于替换新的节点）
          curr.path.remove();
        }
        return expression;
      }, null)
    )
  );
}

/**
 * 转换if指令
 * @param path
 */
function transformIf(path) {
  if (elemUtil(path).findAttrPath(DIRECTIVES.IF)) {
    traverseList = [];
    traverseIf(path.parentPath);

    traverseList.forEach((conditions) => transform(conditions));
  }
}

module.exports = transformIf;
