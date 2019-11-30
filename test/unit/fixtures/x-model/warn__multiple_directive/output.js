class A extends React.Component {
  render() {
    return (
      <input
        value={this.state.dataB}
        onChange={(..._args) => {
          let _value = require("babel-plugin-react-directives/runtime/resolve-value.js")(
            _args
          );

          this.setState(_prevState => {
            return {
              dataB: _value
            };
          });
        }}/>
    );
  }
}
