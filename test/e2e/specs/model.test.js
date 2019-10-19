import React from 'react';
import { mount } from 'enzyme';
import {
  DemoModel1,
  DemoModel2,
  DemoModel3,
  DemoModel4
} from './Demo';

describe('directive: model', () => {
  test('in class', () => {
    const wrapper = mount(<DemoModel1/>);
    wrapper.find('input').simulate('change', { target: { value: 'new value' } });
    expect(wrapper.find('.text').text()).toBe('new value');
    expect(wrapper.find('.extra').text()).toBe('B');
  });

  test('use hook', () => {
    const wrapper = mount(<DemoModel2/>);
    wrapper.find('input').simulate('change', { target: { value: 'new value' } });
    expect(wrapper.find('.text').text()).toBe('new value');
    expect(wrapper.find('.extra').text()).toBe('foo');
  });

  test('custom onChange event', () => {
    const wrapper = mount(<DemoModel3/>);
    wrapper.find('input').simulate('change', { target: { value: 'custom value' } });
    expect(wrapper.find('.text').text()).toBe('custom value');
  });

  test('merge onChange', () => {
    const fn = jest.fn();
    const wrapper = mount(<DemoModel4 fn={fn}/>);
    wrapper.find('input').simulate('change', { target: { value: 'custom value' } });
    expect(wrapper.find('.text').text()).toBe('custom value');
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0].target.value).toBe('custom value');
  });

  test('merge extraProps', () => {
    const fn = jest.fn();
    const fn2 = jest.fn();
    const extraProps = {
      onChange: fn2
    };
    const wrapper = mount(<DemoModel4 fn={fn} extraProps={extraProps}/>);
    wrapper.find('input').simulate('change', { target: { value: 'custom value' } });
    expect(wrapper.find('.text').text()).toBe('custom value');
    expect(fn.mock.calls.length).toBe(0);
    expect(fn2.mock.calls.length).toBe(1);
    expect(fn2.mock.calls[0][0].target.value).toBe('custom value');
  });
});
