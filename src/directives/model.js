const { types: t, DIRECTIVES, codeFrameWarn } = require('../shared');
const attrUtil = require('../utils/attribute');
const elementUtil = require('../utils/element');
const builder = require('../utils/builder');

/**
 * 创建更新state表达式
 */
function buildUpdateStateExpression(path) {
  const isClassComponent = path.findParent((parentPath) => t.isClassBody(parentPath.node));

  if (isClassComponent) {
    //
  } else {
    //
  }

  return t.callExpression(
    builder.buildMemberExpression(
      t.thisExpression(),
      t.identifier('setState')
    ),
    [t.objectExpression([
      // t.objectProperty(
      //
      // )
    ])]
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
    codeFrameWarn(
      attrPath,
      `\`${DIRECTIVES.MODEL}\` used on element <${elementUtil(path).getName()}> without binding value`
    );
    attrPath.remove();
    return;
  }

  /* istanbul ignore next: print warn info */
  if (t.isStringLiteral(bindingValue)) {
    codeFrameWarn(
      attrPath,
      `When the \`${DIRECTIVES.MODEL}\` prop binding value is a string literal, the component will not be updated accordingly`
    );
  }

  // replace `value` prop
  elementUtil(path).mergeAttributes({
    attrName: 'value',
    directivePath: attrPath,
    callback(attr) {
      /* istanbul ignore next: print warn info */
      if (attrUtil(attr).getName() === 'value') {
        codeFrameWarn(
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


  const args = path.scope.generateUidIdentifier('args');
  const val = path.scope.generateUidIdentifier('val');
  const extraFn = path.scope.generateUidIdentifier('extraFn');

  // merge `onChange` prop
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
        [t.restElement(args)],
        t.blockStatement([

          // let _val = _args[0] && (_args[0].target instanceof window.Element) ? _args[0].target.value : _args[0]
          t.variableDeclaration('let', [
            t.variableDeclarator(
              val,
              t.conditionalExpression(
                t.logicalExpression(
                  '&&',
                  builder.buildMemberExpression(
                    args,
                    t.numericLiteral(0)
                  ),
                  t.binaryExpression(
                    'instanceof',
                    builder.buildMemberExpression(
                      args,
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
                  args,
                  t.numericLiteral(0),
                  t.identifier('target'),
                  t.identifier('value'),
                ),
                builder.buildMemberExpression(
                  args,
                  t.numericLiteral(0)
                )
              )
            )
          ]),

          // 执行更新state方法
          t.expressionStatement(
            buildUpdateStateExpression(path)
          ),

          // let _extraFn = {}.onChange;
          mergeItems.length > 0 && t.variableDeclaration('let', [
            t.variableDeclarator(
              extraFn,
              builder.buildMemberExpression(
                t.objectExpression(
                  mergeItems.map((item) => t.spreadElement(item))
                ),
                t.identifier('onChange')
              )
            )
          ]),

          // typeof _extraFn === "function" && _extraFn(..._args);
          mergeItems.length > 0 && t.expressionStatement(
            t.logicalExpression(
              '&&',
              t.binaryExpression(
                '===',
                t.unaryExpression(
                  'typeof',
                  extraFn
                ),
                t.stringLiteral('function')
              ),
              t.callExpression(
                extraFn,
                [t.spreadElement(args)]
              )
            )
          )
        ].filter(Boolean))
      );
    },
  });
}


module.exports = transformModel;
