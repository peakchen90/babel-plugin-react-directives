const a = <div>{testA ? <p>Aa</p> : testAb ? <p>Ab</p> : <p>Ac</p>}</div>;

const b = (
  <div
    style={{
      display: testB ? undefined : "none"
    }}>
    B
  </div>
);

class C {
  render() {
    return (
      <input
        value={this.state.testC}
        onChange={(..._args) => {
          let _value =
            _args[0] && _args[0].target && typeof _args[0].target === "object"
              ? _args[0].target.value
              : _args[0];

          this.setState(_prevState => {
            return {
              testC: _value
            };
          });
        }}/>
    );
  }
}
