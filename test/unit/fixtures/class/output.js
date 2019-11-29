const a = (
  <div
    className={require("babel-plugin-react-directives/lib/runtime").classNames({
      foo: false,
      bar: true
    })}>
    A
  </div>
);

const b = (
  <div
    className={require("babel-plugin-react-directives/lib/runtime").classNames([
      ...require("babel-plugin-react-directives/lib/runtime").mergeProps.call(
        this,
        "className",
        [
          {
            className: "b"
          }
        ]
      ),
      "foo"
    ])}>
    B
  </div>
);
