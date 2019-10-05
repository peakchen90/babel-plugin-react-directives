class B extends React.Component {
  render() {
    const { a: [{ data }] } = this.state
    return <input x-model={data}/>
  }
}
