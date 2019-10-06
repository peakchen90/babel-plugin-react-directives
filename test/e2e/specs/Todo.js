/* eslint-disable max-classes-per-file, react/prop-types */
/* eslint-disable no-undef, no-unused-vars */

import React from 'react';

export default class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      list: []
    };
  }

  onAdd() {
    const { list, searchText } = this.state;
    this.setState((prevState) => ({
      list: list.concat(searchText)
    }));
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
