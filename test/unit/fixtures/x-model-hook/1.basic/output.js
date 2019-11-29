const A = () => {
  const [data, setData] = useState(0);
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

const B = () => {
  const data = useState(0);
  return (
    <input
      value={data[0]}
      onChange={(..._args2) => {
        let _value2 = require("babel-plugin-react-directives/lib/runtime").resolveValue(
          _args2
        );

        data[1](_value2);
      }}/>
  );
};
