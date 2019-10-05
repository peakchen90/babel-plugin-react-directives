class A extends React.Component {
  render() {
    const state = this.state;
    return (
      <input
        value={state.data}
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

class B extends React.Component {
  render() {
    const a = this.state;
    const data = a.data;
    return (
      <input
        value={data}
        onChange={(..._args2) => {
          let _value2 =
            _args2[0] && _args2[0].target && typeof _args2[0].target === "object"
              ? _args2[0].target.value
              : _args2[0];

          this.setState(_prevState2 => {
            return {
              data: _value2
            };
          });
        }}/>
    );
  }
}
