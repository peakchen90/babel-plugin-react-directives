const {
  types: t, DIRECTIVES, DirectiveData, codeFrameWarn
} = require('../shared');
const attrUtil = require('../utils/attribute');
const elementUtil = require('../utils/element');
const builderUtil = require('../utils/builder');


/**
 * 1. 先找到一个包含if指令的JSXElement，并以它的父节点开始遍历JSXElement
 *    1.1 如果找到包含if指令时，查找其后的else-if及else指令
 *    1.2 在1.1找到的目标指令时，递归查找子节点的if指令，并执行1.1，执行完成后将这次所有的条件语句push到栈中（确保子节点先入栈，遍历时先遍历子节点）
 * 2. 递归查找完成时，将栈里的每组条件指令依次转为为对应的条件表达式
 */


// 保存遍历列表（二维数组，每个属性是包含一组条件的数组）
let _traverseList = [];


/**
 * 遍历包含 if 指令的 JSXElement
 * @param path
 * @return {Array}
 */
function traverseIf(path) {
  const nestedVisitor = {
    JSXElement(_path) {
      const _elementUtil = elementUtil(_path);
      const attrPath = _elementUtil.findAttributeByName(DIRECTIVES.IF);
      if (
        attrPath
        // 一个JSXElement不能同时存在2个if指令
        && _elementUtil.findAllAttributes().every((item) => (
          item === attrPath
          || attrUtil(item).getName() !== DIRECTIVES.IF
        ))
      ) {
        _path.skip(); // 跳过遍历子JSXElement节点

        _traverseList.push(traverseConditional(_path, attrPath));
      }
    }
  };

  // visitor使用引用，防止每次遍历创建新的visitor对象
  path.traverse(nestedVisitor);

  return _traverseList;
}

/**
 * 遍历一组条件JSXElement
 * @param path
 * @param attrPath
 * @param _result
 * @return {*|Array}
 */
function traverseConditional(path, attrPath, _result) {
  const result = _result || [];

  if (result.length === 0 && attrUtil(attrPath).getName() === DIRECTIVES.IF) {
    if (!attrUtil(attrPath).getValueExpression()) {
      throw attrPath.buildCodeFrameError(
        `\`${DIRECTIVES.IF}\` used on element <${elementUtil(path).getName()}> without binding value`
      );
    }
    traverseIf(path);
    result.push(new DirectiveData(DIRECTIVES.IF, path, attrPath));
  }

  // 查找else-if指令
  path = elementUtil(path).findNextSibling();
  attrPath = elementUtil(path).findAttributeByName(DIRECTIVES.ELSE_IF);
  if (attrPath) {
    if (!attrUtil(attrPath).getValueExpression()) {
      throw attrPath.buildCodeFrameError(
        `\`${DIRECTIVES.ELSE_IF}\` used on element <${elementUtil(path).getName()}> without binding value`
      );
    }
    traverseIf(path);
    result.push(new DirectiveData(DIRECTIVES.ELSE_IF, path, attrPath));
    return traverseConditional(path, attrPath, result);
  }

  // 查找else指令
  attrPath = elementUtil(path).findAttributeByName(DIRECTIVES.ELSE);
  if (attrPath) {
    if (attrUtil(attrPath).getValueExpression()) {
      codeFrameWarn(
        attrPath,
        `\`${DIRECTIVES.ELSE}\` used on element <${elementUtil(path).getName()}> should not have a binding value`
      );
    }
    traverseIf(path);
    result.push(new DirectiveData(DIRECTIVES.ELSE, path, attrPath));
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

  // 根节点使用 if 指令
  if (!t.isJSXElement(path.parent) && !t.isJSXFragment(path.parent)) {
    path.replaceWith(
      t.logicalExpression(
        '&&',
        builderUtil.buildBooleanExpression(attrUtil(attrPath).getValueExpression()),
        path.node
      )
    );
    attrPath.remove();
    return;
  }

  path.replaceWith(
    t.jSXExpressionContainer(
      conditions.reduceRight((prev, curr, index) => {
        const test = attrUtil(curr.attrPath).getValueExpression();

        let expression;
        if (!prev) {
          // 最后一个节点是else
          if (curr.directive === DIRECTIVES.ELSE) {
            expression = curr.path.node;
          } else {
            expression = t.conditionalExpression(
              test,
              curr.path.node,
              t.identifier('null')
            );
          }
        } else {
          expression = t.conditionalExpression(
            test,
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
 * @param traverseList
 */
function transformIf(path) {
  if (elementUtil(path).findAttributeByName(DIRECTIVES.IF)) {
    _traverseList = [];
    traverseIf(path.parentPath);

    _traverseList.forEach((conditions) => transform(conditions));
  }
}

module.exports = transformIf;
