const a = (
  <div
    {...spreadA}
    className={require("react-directives-runtime/classnames.js")([
      require("react-directives-runtime/merge-props.js").call(
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
    className={require("react-directives-runtime/classnames.js")([
      require("react-directives-runtime/merge-props.js").call(
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
