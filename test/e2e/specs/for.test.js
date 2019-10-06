import React from 'react';
import { shallow } from 'enzyme';
import { DemoFor } from './Demo';

describe('directive: for', () => {
  test('traverse list', () => {
    const list = [
      { id: 'a', name: 'Alice' },
      { id: 'b', name: 'Bob' },
      { id: 'c', name: 'Cindy' }
    ];

    const wrapper = shallow(<DemoFor list={list}/>);
    list.forEach((item, index) => {
      const li = wrapper.find('li').at(index);
      expect(li.key()).toBe(item.id);
      expect(li.text()).toBe(`${item.name}-${index}`);
    });
  });
});
