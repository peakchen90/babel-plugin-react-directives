const A = () => {
  const [data, setData] = Preact.useState(0);
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
