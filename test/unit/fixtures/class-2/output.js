const a = (
  <div
    {...spreadA}
    className={require("babel-plugin-react-directives/lib/runtime").classNames([
      ...require("babel-plugin-react-directives/lib/runtime").mergeProps.call(
        this,
        "className",
        [
          {
            className: "a"
          },
          spreadA
        ]
      ),
      foo
    ])}/>
);

const b = (
  <div
    {...spreadB}
    {...spreadC}
    className={require("babel-plugin-react-directives/lib/runtime").classNames([
      ...require("babel-plugin-react-directives/lib/runtime").mergeProps.call(
        this,
        "className",
        [
          {
            className: "b"
          },
          spreadC
        ]
      ),
      bar
    ])}/>
);
