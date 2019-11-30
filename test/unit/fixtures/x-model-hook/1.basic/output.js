const A = () => {
  const [data, setData] = useState(0);
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

const B = () => {
  const data = useState(0);
  return (
    <input
      value={data[0]}
      onChange={(..._args2) => {
        let _value2 = require("babel-plugin-react-directives/runtime/resolve-value.js")(
          _args2
        );

        data[1](_value2);
      }}/>
  );
};
