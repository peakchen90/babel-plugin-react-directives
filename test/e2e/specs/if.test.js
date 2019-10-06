import React from 'react';
import { shallow } from 'enzyme';
import { setStatePromisify } from '../util';
import { DemoIf } from './Demo';

describe('directive: if & else-if & else', () => {
  const wrapper = shallow(<DemoIf/>);

  test('if', async () => {
    await setStatePromisify(wrapper, { data: 'A' });
    expect(wrapper.find('div').text()).toBe('A');
  });

  test('else-if', async () => {
    await setStatePromisify(wrapper, { data: 'B' });
    expect(wrapper.find('div').text()).toBe('B');
  });

  test('else-if again', async () => {
    await setStatePromisify(wrapper, { data: 'C' });
    expect(wrapper.find('div').text()).toBe('C');
  });

  test('else', async () => {
    await setStatePromisify(wrapper, { data: 'other' });
    expect(wrapper.find('div').text()).toBe('D');
  });
});
