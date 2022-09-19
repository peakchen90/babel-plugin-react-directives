const a = (
  <div
    className={require("react-directives-runtime/classnames.js")([
      require("react-directives-runtime/merge-props.js").call(
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
