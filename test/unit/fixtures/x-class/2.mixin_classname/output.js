const a = (
  <div
    className={require("babel-plugin-react-directives/lib/runtime").classNames([
      ...require("babel-plugin-react-directives/lib/runtime").mergeProps.call(
        this,
        "className",
        [
          {
            className: "a"
          }
        ]
      ),
      "foo"
    ])}/>
);
