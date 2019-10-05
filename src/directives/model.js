const { types: t, DIRECTIVES, opts } = require('../shared');
const util = require('../utils/util');
const attrUtil = require('../utils/attribute');
const elementUtil = require('../utils/element');
const builder = require('../utils/builder');


/**
 * 返回使用的类型 'class', 'hook', null
 * @param path
 * @return {string|null}
 */
function getUseType(path) {
  let findFunc = false;

  const findClass = path.findParent((parentPath) => {
    if (
      !findFunc
      && (t.isFunctionDeclaration(parentPath.node)
      || t.isArrowFunctionExpression(parentPath.node))
    ) {
      findFunc = true;
    }
    return t.isClassBody(parentPath.node);
  });
  if (findClass) {
    return 'class';
  }
  if (findFunc) {
    return 'hook';
  }
  return null;
}

/**
 * 合并值
 * @param attrPath
 * @param stateBindingStack
 * @param newValExpression
 * @param prevState
 * @param useType
 * @return {{statements: *, value: *}}
 */
function getMergeValueExpression(
  {
    attrPath,
    stateBindingStack,
    newValExpression,
    prevState,
    useType
  }
) {
  const nodeStack = stateBindingStack.map((_path) => _path.node);
  const statements = [];

  const resolveValues = nodeStack.map((node, index) => {
    return builder.buildMemberExpression(
      prevState,
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

  // 返回合并结果表达式
  const result = nodeStack.reduceRight((prevVar, currentNode, index) => {
    const scopeVar = attrPath.scope.generateUidIdentifier('val');
    if (index === 0) {
      if (useType === 'class') {
        return t.objectExpression([
          t.objectProperty(
            currentNode,
            prevVar || newValExpression
          )
        ]);
      }
      if (t.isNumericLiteral(currentNode)) {
        statements.push(...defineStatements(
          currentNode,
          scopeVar,
          prevVar || newValExpression,
          prevState
        ));
        return scopeVar;
      }
      return t.objectExpression([
        t.spreadElement(
          prevState
        ),
        t.objectProperty(
          currentNode,
          prevVar || newValExpression
        )
      ]);
    }

    statements.push(...defineStatements(
      currentNode,
      scopeVar,
      prevVar || newValExpression,
      resolveValues[index - 1]
    ));

    return scopeVar;
  }, null);

  return {
    statements,
    result
  };
}

/**
 * 创建 this.setState 表达式(Class组件方式)
 * @param attrPath
 * @param stateBindingStack
 * @param newValExpression
 * @return {CallExpression}
 */
function buildClassSetStateExpression(attrPath, stateBindingStack, newValExpression) {
  const prevStateVar = attrPath.scope.generateUidIdentifier('prevState');

  const {
    statements,
    result
  } = getMergeValueExpression({
    attrPath,
    stateBindingStack,
    newValExpression,
    prevState: prevStateVar,
    useType: 'class'
  });


  return [
    t.expressionStatement(
      t.callExpression(
        builder.buildMemberExpression(
          t.thisExpression(),
          t.identifier('setState')
        ),
        [
          t.arrowFunctionExpression(
            [prevStateVar],
            t.blockStatement([
              ...statements,
              t.returnStatement(result)
            ])
          )
        ]
      )
    )
  ];
}

/**
 * 创建更新状态表达式(HOOK方式)
 * @param attrPath
 * @param stateBindingStack
 * @param newValExpression
 * @return {CallExpression}
 */
function buildHookSetStateExpression(attrPath, stateBindingStack, newValExpression) {
  const defineVar = stateBindingStack[0].parentPath;
  /* istanbul ignore next: unknown exception */
  if (!t.isVariableDeclarator(defineVar && defineVar.node)) {
    throw attrPath.buildCodeFrameError(
      `You seem to use \`${DIRECTIVES.MODEL}\` in the hook method, this is invalid for \`${DIRECTIVES.MODEL}\`.`
    );
  }

  const defineVarId = defineVar.get('id');
  let canMerge = false;
  let prevState;
  let updateFn;

  if (t.isArrayPattern(defineVarId.node)) {
    prevState = defineVarId.node.elements[0];
    updateFn = defineVarId.node.elements[1];
    canMerge = t.isIdentifier(prevState);
  } else if (t.isObjectPattern(defineVarId.node)) {
    const find = defineVarId.node.properties.find((n) => (
      t.isNumericLiteral(n.key) && n.key.value === 1
    ));
    if (find) {
      prevState = defineVarId.node.properties.find((n) => (
        t.isNumericLiteral(n.key) && n.key.value === 0
      )).value;
      canMerge = t.isIdentifier(prevState);
      updateFn = find.value;
    }
  } else if (t.isIdentifier(defineVarId.node)) {
    prevState = builder.buildMemberExpression(
      defineVarId.node,
      t.numericLiteral(0)
    );
    updateFn = builder.buildMemberExpression(
      defineVarId.node,
      t.numericLiteral(1)
    );
    canMerge = true;
  }

  if (!t.isIdentifier(updateFn) && !t.isMemberExpression(updateFn)) {
    throw defineVarId.buildCodeFrameError(
      `You seem to use \`${DIRECTIVES.MODEL}\` in the hook method, cannot found method to update state.`
    );
  }

  stateBindingStack = stateBindingStack.slice(2);
  let statements = [];
  let result;

  if (stateBindingStack.length === 0) {
    result = newValExpression;
  } else if (!canMerge) {
    throw defineVarId.buildCodeFrameError(
      `You seem to use \`${DIRECTIVES.MODEL}\` in the hook method, which cannot be merged with the previous value.`
    );
  } else {
    const mergeResult = getMergeValueExpression({
      attrPath,
      stateBindingStack,
      newValExpression,
      prevState,
      useType: 'hook'
    });
    statements = mergeResult.statements;
    result = mergeResult.result;
  }

  return [
    ...statements,
    t.expressionStatement(
      t.callExpression(
        updateFn,
        [result]
      )
    )
  ];
}

/**
 * 设置value prop
 * @param path
 * @param attrPath
 * @param bindingValue
 */
function setValueProp(path, attrPath, bindingValue) {
  elementUtil(path).mergeAttributes({
    attrName: 'value',
    directivePath: attrPath,
    find(attr) {
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
    getResult: () => bindingValue,
  });
}

/**
 * 设置onChange prop
 * @param path
 * @param attrPath
 * @param bindingValue
 * @param useType
 */
function setOnChangeProp(path, attrPath, stateBindingStack, useType) {
  const argsVar = path.scope.generateUidIdentifier('args');
  const valueVar = path.scope.generateUidIdentifier('value');
  const extraFnVar = path.scope.generateUidIdentifier('extraFn');
  const setStateExpression = useType === 'class'
    ? buildClassSetStateExpression(attrPath, stateBindingStack, valueVar)
    : buildHookSetStateExpression(attrPath, stateBindingStack, valueVar);

  elementUtil(path).mergeAttributes({
    attrName: 'onChange',
    directivePath: attrPath,
    find(attr, setValue) {
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
        [t.restElement(argsVar)],
        t.blockStatement([

          /**
           * let _val =
           *    _args[0] && (_args[0].target instanceof window.Element)
           *      ? _args[0].target.value
           *      : _args[0]
           */
          t.variableDeclaration('let', [
            t.variableDeclarator(
              valueVar,
              t.conditionalExpression(
                t.logicalExpression(
                  '&&',
                  t.logicalExpression(
                    '&&',
                    builder.buildMemberExpression(
                      argsVar,
                      t.numericLiteral(0)
                    ),
                    builder.buildMemberExpression(
                      argsVar,
                      t.numericLiteral(0),
                      t.identifier('target')
                    )
                  ),
                  t.binaryExpression(
                    '===',
                    t.unaryExpression(
                      'typeof',
                      builder.buildMemberExpression(
                        argsVar,
                        t.numericLiteral(0),
                        t.identifier('target')
                      )
                    ),
                    t.stringLiteral('object')
                  )
                ),
                builder.buildMemberExpression(
                  argsVar,
                  t.numericLiteral(0),
                  t.identifier('target'),
                  t.identifier('value'),
                ),
                builder.buildMemberExpression(
                  argsVar,
                  t.numericLiteral(0)
                )
              )
            )
          ]),

          /**
           * 执行更新state方法
           */
          ...setStateExpression,

          /**
           * let _extraFn = {}.onChange;
           */
          mergeItems.length > 0 && t.variableDeclaration('let', [
            t.variableDeclarator(
              extraFnVar,
              builder.buildMemberExpression(
                t.objectExpression(
                  mergeItems.map((item) => t.spreadElement(item))
                ),
                t.identifier('onChange')
              )
            )
          ]),

          /**
           * typeof _extraFn === "function" && _extraFn.apply(this, _args);
           */
          mergeItems.length > 0 && t.expressionStatement(
            t.logicalExpression(
              '&&',
              t.binaryExpression(
                '===',
                t.unaryExpression(
                  'typeof',
                  extraFnVar
                ),
                t.stringLiteral('function')
              ),
              t.callExpression(
                t.memberExpression(
                  extraFnVar,
                  t.identifier('apply')
                ),
                [
                  t.thisExpression(),
                  argsVar
                ]
              )
            )
          )
        ].filter(Boolean))
      );
    },
  });
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

  const useType = getUseType(path);
  if (!useType) {
    throw attrPath.buildCodeFrameError(
      `The \`${DIRECTIVES.MODEL}\` is not used in the class, nor is it used in the method using the useState hook.`
    );
  }

  const valuePath = attrUtil(attrPath).getValuePath();
  const stateBindingStack = util.getReferenceStack(valuePath);

  if (useType === 'class') {
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
        `The \`${DIRECTIVES.MODEL}\` binding value should define in \`this.state\`.`
      );
    }
    if (stateBindingStack.length === 0) {
      throw valuePath.buildCodeFrameError(
        `The \`${DIRECTIVES.MODEL}\` binding value cannot be \`this.state\`.`
      );
    }
    if (t.isNumericLiteral(stateBindingStack[0].node)) {
      throw valuePath.buildCodeFrameError(
        `The \`${DIRECTIVES.MODEL}\` binding value cannot use \`this.state\` as an array.`
      );
    }
  } else if (useType === 'hook') {
    const useStatePath = stateBindingStack[0];
    let valid = false;
    if (!t.isCallExpression(useStatePath && useStatePath.node)) {
      valid = false;
    } else {
      const callee = useStatePath.node.callee;
      if (
        t.isIdentifier(callee, { name: 'useState' })
        || (t.isMemberExpression(callee)
        && t.isIdentifier(callee.object, { name: opts.pragmaType })
        && (t.isIdentifier(callee.property, { name: 'useState' })
          || t.isStringLiteral(callee.property, { value: 'useState' })))
      ) {
        valid = true;
      }
    }
    if (!valid) {
      throw valuePath.buildCodeFrameError(
        `You seem to use \`${DIRECTIVES.MODEL}\` in the hook method, `
        + `the \`${DIRECTIVES.MODEL}\` binding value cannot be found in the returned of \`${opts.pragmaType}.useState()\`.`
      );
    }

    const stateValuePath = stateBindingStack[1];
    if (
      !t.isNumericLiteral(stateValuePath && stateValuePath.node)
      || stateValuePath.node.value !== 0
    ) {
      throw valuePath.buildCodeFrameError(
        `You seem to use \`${DIRECTIVES.MODEL}\` in the hook method, `
        + `the \`${DIRECTIVES.MODEL}\` binding value cannot be found in the first returned of \`${opts.pragmaType}.useState()\`. `
        + 'For example: `let [data, setData] = useState(initialValue)`, `data` should be used as the binding value.'
      );
    }
  }

  setValueProp(path, attrPath, bindingValue);
  setOnChangeProp(path, attrPath, stateBindingStack, useType);
  attrPath.remove();
}

module.exports = transformModel;
