const A = () => {
  const [data, setData] = useState(0);
  return (
    <input
      value={data}
      onChange={(..._args) => {
        let _value =
          _args[0] && _args[0].target instanceof window.Element
            ? _args[0].target.value
            : _args[0];

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
        let _value2 =
          _args2[0] && _args2[0].target instanceof window.Element
            ? _args2[0].target.value
            : _args2[0];

        data[1](_value2);
      }}/>
  );
};
