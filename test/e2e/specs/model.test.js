import React from 'react';
import { mount } from 'enzyme';
import { DemoModel1, DemoModel2, DemoModel3 } from './Demo';

describe('model', () => {
  test('in class', () => {
    const wrapper = mount(<DemoModel1/>);
    wrapper.find('input').simulate('change', {
      target: { value: 'new value' }
    });
    expect(wrapper.find('.text').text()).toBe('new value');
    expect(wrapper.find('.extra').text()).toBe('B');
  });

  test('use hook', () => {
    const wrapper = mount(<DemoModel2/>);
    wrapper.find('input').simulate('change', {
      target: { value: 'new value' }
    });
    expect(wrapper.find('.text').text()).toBe('new value');
    expect(wrapper.find('.extra').text()).toBe('foo');
  });

  test('custom onChange event', () => {
    const wrapper = mount(<DemoModel3/>);
    wrapper.find('input').simulate('change', {
      target: { value: 'custom value' }
    });
    expect(wrapper.find('.text').text()).toBe('custom value');
  });
});
