const { types: t, DIRECTIVES } = require('../shared');
const util = require('../utils/util');
const attrUtil = require('../utils/attribute');
const elementUtil = require('../utils/element');
const builder = require('../utils/builder');


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

/**
 * 创建 this.setState 表达式(Class组件方式)
 * @param path
 * @return {CallExpression}
 */
function buildClassSetStateExpression(path, stateBindingStack, valueExpression) {
  const scopePrevState = path.scope.generateUidIdentifier('prevState');
  const nodeStack = stateBindingStack.map((_path) => _path.node);
  const statements = [];

  const resolveValue = nodeStack.map((node, index) => {
    return builder.buildMemberExpression(
      scopePrevState,
      ...(index === nodeStack.length - 1
        ? nodeStack
        : nodeStack.filter((_, i) => i <= index))
    );
  });

  // 定义语句
  const defineStatements = (node, varId, value, resolveExp) => {
    if (t.isNumericLiteral(node)) {
      return [
        t.variableDeclaration('let', [
          t.variableDeclarator(
            varId,
            t.arrayExpression([
              t.spreadElement(
                resolveExp
              )
            ])
          )
        ]),
        t.expressionStatement(
          t.callExpression(
            t.memberExpression(
              varId,
              t.identifier('splice')
            ),
            [
              node,
              t.numericLiteral(1),
              value
            ]
          )
        )
      ];
    }
    return [
      t.variableDeclaration('let', [
        t.variableDeclarator(
          varId,
          t.objectExpression([
            resolveExp && t.spreadElement(resolveExp),
            t.objectProperty(
              node,
              value
            )
          ].filter(Boolean))
        )
      ])
    ];
  };

  // this.setState 返回值表达式
  const resultStatement = nodeStack.reduceRight((prevVar, currentNode, index) => {
    const scopeVar = path.scope.generateUidIdentifier('val');
    if (index === 0) {
      return t.returnStatement(
        t.objectExpression([
          t.objectProperty(
            currentNode,
            prevVar || valueExpression
          )
        ])
      );
    }

    if (!prevVar) {
      statements.push(...defineStatements(
        currentNode,
        scopeVar,
        valueExpression,
        resolveValue[index - 1]
      ));
    } else if (index > 0) {
      statements.push(...defineStatements(
        currentNode,
        scopeVar,
        prevVar,
        resolveValue[index - 1]
      ));
    }
    return scopeVar;
  }, null);

  return t.callExpression(
    builder.buildMemberExpression(
      t.thisExpression(),
      t.identifier('setState')
    ),
    [
      t.arrowFunctionExpression(
        [scopePrevState],
        t.blockStatement([
          ...statements,
          resultStatement
        ])
      )
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

  // 使用类型: 'class', null
  const useType = getUseType(path);
  if (!useType) {
    throw attrPath.buildCodeFrameError(
      `The \`${DIRECTIVES.MODEL}\` cannot be used outside of class`
    );
  }

  const valuePath = attrUtil(attrPath).getValuePath();
  const stateBindingStack = util.getReferenceStack(valuePath);
  const thisPath = stateBindingStack.shift();
  const statePath = stateBindingStack.shift();
  if (
    !t.isThisExpression(thisPath && thisPath.node)
    || (
      !t.isIdentifier(statePath && statePath.node, { name: 'state' })
      && !t.isStringLiteral(statePath && statePath.node, { value: 'state' })
    )
  ) {
    throw valuePath.buildCodeFrameError(
      `The \`${DIRECTIVES.MODEL}\` binding value should define in \`this.state\``
    );
  }
  if (stateBindingStack.length === 0) {
    throw valuePath.buildCodeFrameError(
      `The \`${DIRECTIVES.MODEL}\` binding value cannot be \`this.state\``
    );
  }
  if (t.isNumericLiteral(stateBindingStack[0].node)) {
    throw valuePath.buildCodeFrameError(
      `The \`${DIRECTIVES.MODEL}\` binding value cannot use \`this.state\` as an array`
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
  const scopeValue = path.scope.generateUidIdentifier('value');
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
              scopeValue,
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
            buildClassSetStateExpression(attrPath, stateBindingStack, scopeValue)
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
