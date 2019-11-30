import React from 'react';
import { shallow } from 'enzyme';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 'A'
    };
  }

  render() {
    return (
      <div>
        <p x-if={this.state.data === 'A'}>A</p>
        <p x-else-if={this.state.data === 'B'}>B</p>
        <p x-else-if={this.state.data === 'C'}>C</p>
        <p x-else>D</p>
      </div>
    );
  }
}

describe('directive: if', () => {
  const wrapper = shallow(<Demo/>);

  test('x-if', () => {
    wrapper.setState({ data: 'A' });
    expect(wrapper.find('div').text()).toBe('A');
  });

  test('x-else-if', () => {
    wrapper.setState({ data: 'B' });
    expect(wrapper.find('div').text()).toBe('B');
  });

  test('x-else-if again', () => {
    wrapper.setState({ data: 'C' });
    expect(wrapper.find('div').text()).toBe('C');
  });

  test('x-else', () => {
    wrapper.setState({ data: 'other' });
    expect(wrapper.find('div').text()).toBe('D');
  });
});
