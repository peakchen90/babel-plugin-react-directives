import React from 'react';
import { mount } from 'enzyme';

class Demo1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        a: ['A', 'B']
      }
    };
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <input x-model={data.a[0]}/>
        <p className="text">{data.a[0]}</p>
        <p className="extra">{data.a[1]}</p>
      </div>
    );
  }
}

function Demo2() {
  const [data, setData] = React.useState({
    text: 'a',
    extra: 'foo'
  });
  return (
    <div>
      <input x-model-hook={data.text}/>
      <p className="text">{data.text}</p>
      <p className="extra">{data.extra}</p>
    </div>
  );
}

function Demo3() {
  const CustomInput = ({ value, onChange }) => {
    return <input value={value} onChange={(e) => onChange(e.target.value)}/>;
  };

  const [data, setData] = React.useState('foo');
  return (
    <div>
      <CustomInput x-model-hook={data}/>
      <p className="text">{data}</p>
    </div>
  );
}

function Demo4({ fn, extraProps }) {
  const [data, setData] = React.useState('foo');
  return (
    <div>
      <input x-model-hook={data} onChange={fn} {...extraProps}/>
      <p className="text">{data}</p>
    </div>
  );
}

describe('directive: model', () => {
  test('in class', () => {
    const wrapper = mount(<Demo1/>);
    wrapper.find('input').simulate('change', { target: { value: 'new value' } });
    expect(wrapper.find('.text').text()).toBe('new value');
    expect(wrapper.find('.extra').text()).toBe('B');
  });

  test('use hook', () => {
    const wrapper = mount(<Demo2/>);
    wrapper.find('input').simulate('change', { target: { value: 'new value' } });
    expect(wrapper.find('.text').text()).toBe('new value');
    expect(wrapper.find('.extra').text()).toBe('foo');
  });

  test('custom onChange event', () => {
    const wrapper = mount(<Demo3/>);
    wrapper.find('input').simulate('change', { target: { value: 'custom value' } });
    expect(wrapper.find('.text').text()).toBe('custom value');
  });

  test('merge onChange', () => {
    const fn = jest.fn();
    const wrapper = mount(<Demo4 fn={fn}/>);
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
    const wrapper = mount(<Demo4 fn={fn} extraProps={extraProps}/>);
    wrapper.find('input').simulate('change', { target: { value: 'custom value' } });
    expect(wrapper.find('.text').text()).toBe('custom value');
    expect(fn.mock.calls.length).toBe(0);
    expect(fn2.mock.calls.length).toBe(1);
    expect(fn2.mock.calls[0][0].target.value).toBe('custom value');
  });
});
