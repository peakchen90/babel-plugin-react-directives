import React from 'react';
import { shallow } from 'enzyme';

function Demo({ classNames, className, extraProps = { id: '123' } }) {
  return (
    <div
      x-class={classNames}
      className={className}
      {...extraProps}
    />
  );
}

describe('directive: class', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Demo/>);
  });

  test('binding value: string', () => {
    wrapper.setProps({ classNames: 'foo' });
    expect(wrapper.find('div').prop('className')).toBe('foo');
  });

  test('binding value: array', () => {
    wrapper.setProps({ classNames: ['foo', 'bar'] });
    expect(wrapper.find('div').prop('className')).toBe('foo bar');
  });

  test('binding value: object', () => {
    wrapper.setProps({
      classNames: {
        foo: false,
        bar: true,
        baz: 1,
        qux: ''
      }
    });
    expect(wrapper.find('div').prop('className')).toBe('bar baz');
  });

  test('binding value: mixin', () => {
    wrapper.setProps({
      classNames: [
        'foo',
        { bar: null },
        [
          'baz',
          {
            qux: true,
            xyz: false
          }
        ]
      ]
    });
    expect(wrapper.find('div').prop('className')).toBe('foo baz qux');
  });

  test('mixin className', () => {
    wrapper.setProps({
      classNames: [
        'baz',
        {
          bar: false
        }
      ],
      className: 'foo'
    });
    expect(wrapper.find('div').prop('className')).toBe('foo baz');
  });

  test('mixin spread attribute', () => {
    wrapper.setProps({
      classNames: 'baz',
      className: 'foo',
      extraProps: {
        className: 'abc'
      }
    });
    expect(wrapper.find('div').prop('className')).toBe('abc baz');
  });

  test('css modules', () => {
    const styles = {
      foo: 'foo-xxx',
      bar: 'bar-xxx',
      baz: 'baz-xxx',
    };
    wrapper.setProps({
      classNames: [
        {
          [styles.bar]: true,
          [styles.baz]: false,
        }
      ],
      className: styles.foo
    });
    expect(wrapper.find('div').prop('className')).toBe('foo-xxx bar-xxx');
  });
});
