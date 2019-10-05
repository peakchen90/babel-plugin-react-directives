class A extends React.Component {
  render() {
    return (
      <input
        onChange={this.onChange}
        x-model={this.state.data}
      />
    )
  }
}

class B extends React.Component {
  render() {
    return (
      <input
        onChange={this.onChange}
        value={this.state.data2}
        x-model={this.state.data}
        {...extraProps}
      />
    )
  }
}
