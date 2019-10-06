/* eslint-disable max-classes-per-file, react/prop-types */
/* eslint-disable no-undef, no-unused-vars */
import React from 'react';

export class DemoIf extends React.Component {
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

export class DemoShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  render() {
    return (
      <div
        className="test"
        style={{ color: 'red' }}
        x-show={this.state.visible}
      />
    );
  }
}

export class DemoModel1 extends React.Component {
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

export function DemoModel2() {
  const [data, setData] = React.useState({
    text: 'a',
    extra: 'foo'
  });
  return (
    <div>
      <input x-model={data.text}/>
      <p className="text">{data.text}</p>
      <p className="extra">{data.extra}</p>
    </div>
  );
}

export function DemoModel3() {
  const CustomInput = ({ value, onChange }) => {
    return <input value={value} onChange={(e) => onChange(e.target.value)}/>;
  };

  const [data, setData] = React.useState('foo');
  return (
    <div>
      <CustomInput x-model={data}/>
      <p className="text">{data}</p>
    </div>
  );
}

export function DemoFor({ list }) {
  return (
    <ul>
      <li x-for={(item, index) in list} key={item.id}>{item.name}-{index}</li>
    </ul>
  );
}
