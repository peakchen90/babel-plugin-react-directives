class A extends React.Component {
  render() {
    return (
      <input
        value={this.state.data}
        onChange={(..._args) => {
          let _value =
            _args[0] && _args[0].target && typeof _args[0].target === "object"
              ? _args[0].target.value
              : _args[0];

          this.setState(_prevState => {
            return {
              data: _value
            };
          });
        }}/>
    );
  }
}
