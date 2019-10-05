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
          _args[0] && _args[0].target instanceof window.Element
            ? _args[0].target.value
            : _args[0];

        let _val = [...data.a];

        _val.splice(0, 1, _value);

        setData({ ...data, a: _val });
      }}/>
  );
};

const B = () => {
  const [data, setData] = useState([]);
  return (
    <input
      value={data[2]}
      onChange={(..._args2) => {
        let _value2 =
          _args2[0] && _args2[0].target instanceof window.Element
            ? _args2[0].target.value
            : _args2[0];

        let _val3 = [...data];

        _val3.splice(2, 1, _value2);

        setData(_val3);
      }}/>
  );
};
