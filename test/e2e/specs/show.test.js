import React from 'react';
import { shallow } from 'enzyme';
import { setStatePromisify } from '../util';
import { DemoShow } from './Demo';

describe('directive: show', () => {
  const wrapper = shallow(<DemoShow/>);

  test('show', async () => {
    await setStatePromisify(wrapper, { visible: true });
    const styleProp = wrapper.find('div').prop('style');
    expect(styleProp.color).toBe('red');
    expect(styleProp.display).toBe(undefined);
  });

  test('hide', async () => {
    await setStatePromisify(wrapper, { visible: false });
    const styleProp = wrapper.find('div').prop('style');
    expect(styleProp.color).toBe('red');
    expect(styleProp.display).toBe('none');
  });
});
