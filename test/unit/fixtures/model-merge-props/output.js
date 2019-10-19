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
          let _extraFn = {
            ...{
              onChange: this.onChange
            }
          }.onChange;
          typeof _extraFn === "function" && _extraFn.apply(this, _args);
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
          let _extraFn2 = {
            ...{
              onChange: this.onChange
            },
            ...(extraProps && extraProps.onChange)
          }.onChange;
          typeof _extraFn2 === "function" && _extraFn2.apply(this, _args2);
        }}/>
    );
  }
}
