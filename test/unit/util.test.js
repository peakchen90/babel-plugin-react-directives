const t = require('@babel/types');
const {
  assertVersion,
  isThisExpression,
  isNullLiteral
} = require('../../src/utils/util');

describe('utils/util', () => {
  test('assertVersion', () => {
    expect(() => assertVersion('6.20.0', '>= 6.20.0')).not.toThrowError();
    expect(() => assertVersion('6.20.1', '>= 6.20.0')).not.toThrowError();
    expect(() => assertVersion('6.21.0', '>= 6.20.0')).not.toThrowError();
    expect(() => assertVersion('7.0.0', '>= 6.20.0')).not.toThrowError();
    expect(() => assertVersion('6.19.20', '>= 6.20.0')).toThrowError();
  });

  test('isThisExpression', () => {
    expect(isThisExpression(t.thisExpression())).toBeTruthy();
    expect(isThisExpression(t.identifier('this'))).toBeTruthy();
  });

  test('isNullLiteral', () => {
    expect(isNullLiteral(t.nullLiteral())).toBeTruthy();
    expect(isNullLiteral(t.identifier('null'))).toBeTruthy();
    expect(isNullLiteral(t.identifier('undefined'))).toBeFalsy();
  });
});
