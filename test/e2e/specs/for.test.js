import React from 'react';
import { shallow } from 'enzyme';

function Demo({ list }) {
  return (
    <ul>
      <li x-for={(item, index) in list} key={item.id}>{item.name}-{index}</li>
    </ul>
  );
}

describe('directive: for', () => {
  test('traverse list', () => {
    const list = [
      { id: 'a', name: 'Alice' },
      { id: 'b', name: 'Bob' },
      { id: 'c', name: 'Cindy' }
    ];

    const wrapper = shallow(<Demo list={list}/>);
    list.forEach((item, index) => {
      const li = wrapper.find('li').at(index);
      expect(li.key()).toBe(item.id);
      expect(li.text()).toBe(`${item.name}-${index}`);
    });
  });
});
