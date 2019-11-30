class A extends React.Component {
  render() {
    const state = this.state;
    return (
      <input
        value={state.data}
        onChange={(..._args) => {
          let _value = require("babel-plugin-react-directives/runtime/resolve-value.js")(
            _args
          );

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
          let _value2 = require("babel-plugin-react-directives/runtime/resolve-value.js")(
            _args2
          );

          this.setState(_prevState2 => {
            return {
              data: _value2
            };
          });
        }}/>
    );
  }
}
