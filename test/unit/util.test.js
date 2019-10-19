const { assertVersion } = require('../../src/utils/util');

describe('utils/util', () => {
  test('assertVersion', () => {
    expect(() => assertVersion('6.20.0', '>= 6.20.0')).not.toThrowError();
    expect(() => assertVersion('6.20.1', '>= 6.20.0')).not.toThrowError();
    expect(() => assertVersion('6.21.0', '>= 6.20.0')).not.toThrowError();
    expect(() => assertVersion('7.0.0', '>= 6.20.0')).not.toThrowError();
    expect(() => assertVersion('6.19.20', '>= 6.20.0')).toThrowError();
  });
});
