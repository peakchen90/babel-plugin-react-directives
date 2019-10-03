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
  render = () => (
    <input
      value={testC}
      onChange={(..._args) => {
        let _val =
          _args[0] && _args[0].target instanceof window.Element
            ? _args[0].target.value
            : _args[0];

        this.setState({});
      }}/>
  );
}
