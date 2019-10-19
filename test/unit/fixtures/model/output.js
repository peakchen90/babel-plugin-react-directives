class A extends React.Component {
  render() {
    return (
      <input
        value={this.state.data}
        onChange={(..._args) => {
          let _value = require("babel-plugin-react-directives/lib/runtime").resolveValue(
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
