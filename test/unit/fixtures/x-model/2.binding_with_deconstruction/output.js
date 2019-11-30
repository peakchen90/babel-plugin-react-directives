class B extends React.Component {
  render() {
    const {
      a: [{ data }]
    } = this.state;
    return (
      <input
        value={data}
        onChange={(..._args) => {
          let _value = require("babel-plugin-react-directives/runtime/resolve-value.js")(
            _args
          );

          this.setState(_prevState => {
            let _val = { ..._prevState.a[0], data: _value };
            let _val2 = [..._prevState.a];

            _val2.splice(0, 1, _val);

            return {
              a: _val2
            };
          });
        }}/>
    );
  }
}
