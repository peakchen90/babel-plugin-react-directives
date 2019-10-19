const A = () => {
  const [data, setData] = Preact.useState(0);
  return (
    <input
      value={data}
      onChange={(..._args) => {
        let _value = require("babel-plugin-react-directives/lib/runtime").resolveValue(
          _args
        );

        setData(_value);
      }}/>
  );
};
