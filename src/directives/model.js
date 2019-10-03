const { types: t, DIRECTIVES } = require('../shared');
const util = require('../utils/util');
const attrUtil = require('../utils/attribute');
const elementUtil = require('../utils/element');
const builder = require('../utils/builder');

/**
 * TODO: 1. setState没有处理数组，2. 绑定的值再引用其他的值
 */

/**
 * 返回使用的类型
 * @param path
 * @return {string|null}
 */
function getUseType(path) {
  const findClass = path.findParent((parentPath) => t.isClassBody(parentPath.node));
  if (findClass) {
    return 'class';
  }
  return null;
}

function getStateBindingStack(attrPath) {
  let bindingStack = [];

  const nestedVisitor = {
    Identifier(path) {
      const identifierName = path.node.name;
      let binding = path.scope.bindings[identifierName];

      if (!binding) {
        const targetPath = attrPath.findParent((p) => (
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

      const bindingNode = binding.path.node;

      bindingStack = [
        ...util.getMemberStack(bindingNode.init),
        ...util.findDeconstructionStack(
          binding.path.get('id'),
          identifierName
        )
      ];
      path.stop();
    },
    MemberExpression(path) {
      bindingStack = util.getMemberStack(path.node);
      path.stop();
    }
  };

  attrPath.traverse(nestedVisitor);

  return bindingStack;
}

/**
 * 创建更新state表达式(Class组件方式)
 * @param path
 * @return {CallExpression}
 */
function buildClassSetStateExp(stateBindingStack, valueExpression) {
  return t.callExpression(
    builder.buildMemberExpression(
      t.thisExpression(),
      t.identifier('setState')
    ),
    [
      stateBindingStack.reduceRight((prev, curr, index) => {
        return t.objectExpression([
          index > 0 && t.spreadElement(
            builder.buildMemberExpression(
              t.thisExpression(),
              t.identifier('state'),
              ...stateBindingStack.filter((_, i) => i <= index - 1)
            )
          ),
          t.objectProperty(
            curr,
            prev || valueExpression
          )
        ].filter(Boolean));
      }, null)
    ]
  );
}

/**
 * 转换model指令
 * @param path
 */
function transformModel(path) {
  const attrPath = elementUtil(path).findAttributeByName(DIRECTIVES.MODEL);
  if (!attrPath) {
    return;
  }

  const bindingValue = attrUtil(attrPath).getValueExpression();
  /* istanbul ignore next: print warn info */
  if (!bindingValue) {
    util.codeFrameWarn(
      attrPath,
      `\`${DIRECTIVES.MODEL}\` used on element <${elementUtil(path).getName()}> without binding value`
    );
    attrPath.remove();
    return;
  }

  let bindingValuePath = attrPath.get('value.expression');
  if (!bindingValuePath.node) {
    bindingValuePath = attrPath.get('value');
  }
  if (!t.isIdentifier(bindingValue) && !t.isMemberExpression(bindingValue)) {
    throw bindingValuePath.buildCodeFrameError(
      `The \`${DIRECTIVES.MODEL}\` binding value expected an identifier or a member expression, but got: \`${util.getSourceCode(path, bindingValue)}\``
    );
  }

  // 使用类型: 'class', null
  const useType = getUseType(path);
  if (!useType) {
    throw attrPath.buildCodeFrameError(
      `The \`${DIRECTIVES.MODEL}\` cannot be used outside of class`
    );
  }

  const stateBindingStack = getStateBindingStack(attrPath);
  const thisExp = stateBindingStack.shift();
  const stateExp = stateBindingStack.shift();
  if (!t.isThisExpression(thisExp) || !t.isIdentifier(stateExp, { name: 'state' })) {
    throw bindingValuePath.buildCodeFrameError(
      `The \`${DIRECTIVES.MODEL}\` binding value should define in \`this.state\``
    );
  }
  if (stateBindingStack.length === 0) {
    throw bindingValuePath.buildCodeFrameError(
      `The \`${DIRECTIVES.MODEL}\` binding value cannot be \`this.state\``
    );
  }

  /**
   * 合并 value prop
   */

  elementUtil(path).mergeAttributes({
    attrName: 'value',
    directivePath: attrPath,
    callback(attr) {
      /* istanbul ignore next: print warn info */
      if (attrUtil(attr).getName() === 'value') {
        util.codeFrameWarn(
          attr,
          `The \`value\` prop will be ignored, when use \`${DIRECTIVES.MODEL}\``
        );
        return true;
      }
      return false;
    },
    getResult() {
      return bindingValue;
    },
  });


  /**
   * 合并 onChange prop
   */

  const scopeArgs = path.scope.generateUidIdentifier('args');
  const scopeVal = path.scope.generateUidIdentifier('val');
  const scopeExtraFn = path.scope.generateUidIdentifier('extraFn');

  elementUtil(path).mergeAttributes({
    attrName: 'onChange',
    directivePath: attrPath,
    callback(attr, setValue) {
      if (attrUtil(attr).getName() === 'onChange') {
        setValue(t.objectExpression([
          t.objectProperty(
            t.identifier('onChange'),
            attrUtil(attr).getValueExpression()
          )
        ]));
        return true;
      }
      return false;
    },
    getResult(mergeItems) {
      return t.arrowFunctionExpression(
        [t.restElement(scopeArgs)],
        t.blockStatement([

          // let _val = _args[0] && (_args[0].target instanceof window.Element) ? _args[0].target.value : _args[0]
          t.variableDeclaration('let', [
            t.variableDeclarator(
              scopeVal,
              t.conditionalExpression(
                t.logicalExpression(
                  '&&',
                  builder.buildMemberExpression(
                    scopeArgs,
                    t.numericLiteral(0)
                  ),
                  t.binaryExpression(
                    'instanceof',
                    builder.buildMemberExpression(
                      scopeArgs,
                      t.numericLiteral(0),
                      t.identifier('target')
                    ),
                    builder.buildMemberExpression(
                      t.identifier('window'),
                      t.identifier('Element')
                    ),
                  )
                ),
                builder.buildMemberExpression(
                  scopeArgs,
                  t.numericLiteral(0),
                  t.identifier('target'),
                  t.identifier('value'),
                ),
                builder.buildMemberExpression(
                  scopeArgs,
                  t.numericLiteral(0)
                )
              )
            )
          ]),

          // 执行更新state方法
          t.expressionStatement(
            buildClassSetStateExp(stateBindingStack, scopeVal)
          ),

          // let _extraFn = {}.onChange;
          mergeItems.length > 0 && t.variableDeclaration('let', [
            t.variableDeclarator(
              scopeExtraFn,
              builder.buildMemberExpression(
                t.objectExpression(
                  mergeItems.map((item) => t.spreadElement(item))
                ),
                t.identifier('onChange')
              )
            )
          ]),

          // typeof _extraFn === "function" && _extraFn.apply(this, _args);
          mergeItems.length > 0 && t.expressionStatement(
            t.logicalExpression(
              '&&',
              t.binaryExpression(
                '===',
                t.unaryExpression(
                  'typeof',
                  scopeExtraFn
                ),
                t.stringLiteral('function')
              ),
              t.callExpression(
                t.memberExpression(
                  scopeExtraFn,
                  t.identifier('apply')
                ),
                [
                  t.thisExpression(),
                  scopeArgs
                ]
              )
            )
          )
        ].filter(Boolean))
      );
    },
  });
}


module.exports = transformModel;
