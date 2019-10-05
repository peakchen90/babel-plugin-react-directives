class A extends React.Component {
  render() {
    return (
      <input
        value={this.state.dataB}
        onChange={(..._args) => {
          let _value =
            _args[0] && _args[0].target instanceof window.Element
              ? _args[0].target.value
              : _args[0];

          this.setState(_prevState => {
            return {
              dataB: _value
            };
          });
        }}/>
    );
  }
}
