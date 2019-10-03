var d = require("bb");

var c = "1";

class A extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataA: {
        child: 1
      }
    };
  }

  render() {
    var { state } = this.state.b.c.d;
    return this.b ? (
      <input
        av
        cc
        value={this.state.a.b.c.d.e[1][3]}
        onChange={(..._args) => {
          let _val =
            _args[0] && _args[0].target instanceof window.Element
              ? _args[0].target.value
              : _args[0];

          this.setState({
            a: {
              ...this.state.a,
              b: {
                ...this.state.a.b,
                c: {
                  ...this.state.a.b.c,
                  d: {
                    ...this.state.a.b.c.d,
                    e: {
                      ...this.state.a.b.c.d.e,
                      1: { ...this.state.a.b.c.d.e[1], 3: _val }
                    }
                  }
                }
              }
            }
          });
          let _extraFn = {
            ...{
              onChange: this.c
            }
          }.onChange;
          typeof _extraFn === "function" && _extraFn.apply(this, _args);
        }}/>
    ) : null;
  }
}
