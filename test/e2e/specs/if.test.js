import React from 'react';
import { shallow } from 'enzyme';
import { DemoIf } from './Demo';

describe('directive: if & else-if & else', () => {
  const wrapper = shallow(<DemoIf/>);

  test('if', async () => {
    wrapper.setState({ data: 'A' });
    expect(wrapper.find('div').text()).toBe('A');
  });

  test('else-if', async () => {
    wrapper.setState({ data: 'B' });
    expect(wrapper.find('div').text()).toBe('B');
  });

  test('else-if again', async () => {
    wrapper.setState({ data: 'C' });
    expect(wrapper.find('div').text()).toBe('C');
  });

  test('else', async () => {
    wrapper.setState({ data: 'other' });
    expect(wrapper.find('div').text()).toBe('D');
  });
});
