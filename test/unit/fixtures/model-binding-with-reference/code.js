class A extends React.Component {
  render() {
    const state = this.state;
    return <input x-model={state.data}/>
  }
}

class B extends React.Component {
  render() {
    const a = this.state;
    const data = a.data;
    return <input x-model={data}/>
  }
}
