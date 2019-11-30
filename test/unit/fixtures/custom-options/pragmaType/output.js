const A = () => {
  const [data, setData] = Preact.useState(0);
  return (
    <input
      value={data}
      onChange={(..._args) => {
        let _value = require("babel-plugin-react-directives/runtime/resolve-value.js")(
          _args
        );

        setData(_value);
      }}/>
  );
};
