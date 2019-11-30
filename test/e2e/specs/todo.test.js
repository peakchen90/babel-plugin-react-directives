import React from 'react';
import { mount } from 'enzyme';

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      list: []
    };
  }

  onAdd() {
    const { list, searchText } = this.state;
    this.setState({
      list: list.concat(searchText)
    });
  }

  onRemove(index) {
    const { list } = this.state;
    this.setState({
      list: list.filter((_, i) => i !== index)
    });
  }

  render() {
    const { searchText, list } = this.state;

    return (
      <div>
        <input className="input" type="text" x-model={searchText}/>
        <button className="add" onClick={this.onAdd.bind(this)}>Add</button>
        <button x-show={list.length > 0} className="clear">Clear</button>

        <ul className="todo-list">
          <li
            x-for={(item, index) in list}
            x-if={!searchText || item.indexOf(searchText) !== -1}
            key={item}
            className="todo-item"
          >
            <div>
              <span className="todo-text">{item}</span>
              <a className="remove" onClick={this.onRemove.bind(this, index)}>remove</a>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

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
