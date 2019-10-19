const A = () => {
  const [data, setData] = useState(0);
  const {
    a: [b]
  } = data;
  return (
    <input
      value={b}
      onChange={(..._args) => {
        let _value = require("babel-plugin-react-directives/lib/runtime").resolveValue(
          _args
        );

        let _val = [...data.a];

        _val.splice(0, 1, _value);

        setData({ ...data, a: _val });
      }}/>
  );
};

const B = () => {
  const { 0: data, 1: setData } = useState(0);
  return (
    <input
      value={data}
      onChange={(..._args2) => {
        let _value2 = require("babel-plugin-react-directives/lib/runtime").resolveValue(
          _args2
        );

        setData(_value2);
      }}/>
  );
};
