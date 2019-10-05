const A = () => {
  const [data, setData] = useState(0);
  const {
    a: [b]
  } = data;
  return (
    <input
      value={b}
      onChange={(..._args) => {
        let _value =
          _args[0] && _args[0].target && typeof _args[0].target === "object"
            ? _args[0].target.value
            : _args[0];

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
        let _value2 =
          _args2[0] && _args2[0].target && typeof _args2[0].target === "object"
            ? _args2[0].target.value
            : _args2[0];

        setData(_value2);
      }}/>
  );
};
