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

          require("babel-plugin-react-directives/lib/runtime").invokeOnChange.call(
            this,
            _args,
            [
              {
                onChange: this.onChange
              }
            ]
          );
        }}/>
    );
  }
}

class B extends React.Component {
  render() {
    return (
      <input
        {...extraProps}
        value={this.state.data}
        onChange={(..._args2) => {
          let _value2 = require("babel-plugin-react-directives/lib/runtime").resolveValue(
            _args2
          );

          this.setState(_prevState2 => {
            return {
              data: _value2
            };
          });

          require("babel-plugin-react-directives/lib/runtime").invokeOnChange.call(
            this,
            _args2,
            [
              {
                onChange: this.onChange
              },
              extraProps
            ]
          );
        }}/>
    );
  }
}
