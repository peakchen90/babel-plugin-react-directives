class A extends React.Component {
  render() {
    return <input value={dataA} onChange={(..._args) => {
      let _val = _args[0] && _args[0].target instanceof window.Element ? _args[0].target.value : _args[0];
      this.setState({});
      let _extraFn = {}.onChange;
      typeof _extraFn === "function" && _extraFn(..._args);
    }}/>;
  }
}
