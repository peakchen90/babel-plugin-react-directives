import React from 'react';
import { shallow } from 'enzyme';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      extraProps: {}
    };
  }

  render() {
    return (
      <div
        className="test"
        style={{ color: 'red' }}
        x-show={this.state.visible}
        {...this.state.extraProps}
      />
    );
  }
}

describe('directive: show', () => {
  const wrapper = shallow(<Demo/>);

  test('show', () => {
    wrapper.setState({ visible: true });
    const styleProp = wrapper.find('div').prop('style');
    expect(styleProp.color).toBe('red');
    expect(styleProp.background).toBe(undefined);
    expect(styleProp.display).toBe(undefined);
  });

  test('hide', () => {
    wrapper.setState({ visible: false });
    const styleProp = wrapper.find('div').prop('style');
    expect(styleProp.color).toBe('red');
    expect(styleProp.background).toBe(undefined);
    expect(styleProp.display).toBe('none');
  });

  test('merge props', () => {
    wrapper.setState({
      visible: false,
      extraProps: {
        style: { background: 'green' }
      }
    });
    const styleProp = wrapper.find('div').prop('style');
    expect(styleProp.color).toBe(undefined);
    expect(styleProp.background).toBe('green');
    expect(styleProp.display).toBe('none');
  });
});
