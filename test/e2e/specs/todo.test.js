import React from 'react';
import { mount } from 'enzyme';
import Todo from './Todo';

describe('Todo Component', () => {
  const wrapper = mount(<Todo/>);

  test('add todo', () => {
    wrapper.find('.input').simulate('change', { target: { value: 'First Todo' } });
    wrapper.find('.add').simulate('click');
    expect(wrapper.find('.todo-item .todo-text').at(0).text()).toBe('First Todo');
    expect(wrapper.find('.clear').prop('style').display).toBe(undefined);
  });

  test('search todo', () => {
    wrapper.find('.input').simulate('change', { target: { value: 'Second Todo' } });
    wrapper.find('.add').simulate('click');

    wrapper.find('.input').simulate('change', { target: { value: 'First' } });
    expect(wrapper.find('.todo-item .todo-text').length).toBe(1);
    expect(wrapper.find('.todo-item .todo-text').at(0).text()).toBe('First Todo');
  });

  test('clear todo', () => {
    wrapper.find('.input').simulate('change', { target: { value: '' } });
    expect(wrapper.find('.todo-item .todo-text').length).toBe(2);

    wrapper.find('.todo-item .remove').at(0).simulate('click');
    expect(wrapper.find('.todo-item .todo-text').length).toBe(1);

    wrapper.find('.todo-item .remove').at(0).simulate('click');
    expect(wrapper.find('.todo-item .todo-text').length).toBe(0);
    expect(wrapper.find('.clear').prop('style').display).toBe('none');
  });
});
